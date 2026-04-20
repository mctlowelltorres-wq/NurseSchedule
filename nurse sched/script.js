// COMPLETE WORKING script.js - Copy this EXACTLY
class NurseSchedulingSystem {
    constructor() {
        this.currentWeek = new Date();
        this.schedules = this.loadSchedules();
        this.nurses = ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson', 'Eva Brown'];
        this.currentUser = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.showLoginModal();
        window.nurseSystem = this; // Global reference for modals
    }

    bindEvents() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Navigation buttons
        const prevBtn = document.getElementById('prevWeek');
        const nextBtn = document.getElementById('nextWeek');
        if (prevBtn) prevBtn.addEventListener('click', () => this.prevWeek());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextWeek());

        // Admin controls
        const addBtn = document.getElementById('addShiftBtn');
        const clearBtn = document.getElementById('clearWeekBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        if (addBtn) addBtn.addEventListener('click', () => this.addShift());
        if (clearBtn) clearBtn.addEventListener('click', () => this.clearWeek());
        if (logoutBtn) logoutBtn.addEventListener('click', () => this.logout());

        // Export buttons
        const exportBtns = ['exportPDFBtn', 'exportCSVBtn', 'exportJSONBtn', 'exportSummaryBtn'];
        exportBtns.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', () => {
                    if (id === 'exportPDFBtn') this.exportPDF();
                    else if (id === 'exportCSVBtn') this.exportCSV();
                    else if (id === 'exportJSONBtn') this.exportJSON();
                    else if (id === 'exportSummaryBtn') this.showWeeklySummary();
                });
            }
        });

        const nurseSelect = document.getElementById('nurseSelect');
        if (nurseSelect) nurseSelect.addEventListener('change', () => this.renderCalendar());
    }

    showLoginModal() {
        const modal = document.getElementById('loginModal');
        const app = document.getElementById('mainApp');
        if (modal) modal.classList.remove('hidden');
        if (app) app.classList.add('hidden');
    }

    handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        console.log('Login attempt:', username, password); // Debug log

        // EXACT MATCH REQUIRED
        if (username === 'admin' && password === 'admin123') {
            this.currentUser = { username, role: 'admin' };
            console.log('Admin login successful');
            this.showApp();
            return;
        } 

        if (username === 'nurse' && password === 'nurse123') {
            this.currentUser = { username, role: 'user' };
            console.log('User login successful');
            this.showApp();
            return;
        }

        alert('❌ Invalid credentials!\n\n👑 Admin: admin / admin123\n👩‍⚕️ User: nurse / nurse123');
    }

    showApp() {
        const modal = document.getElementById('loginModal');
        const app = document.getElementById('mainApp');
        const roleBadge = document.getElementById('userRole');
        const adminControls = document.getElementById('adminControls');
        const exportControls = document.getElementById('exportControls');

        if (modal) modal.classList.add('hidden');
        if (app) app.classList.remove('hidden');
        
        if (roleBadge) {
            roleBadge.textContent = this.currentUser.role.toUpperCase();
            roleBadge.className = `role-badge ${this.currentUser.role}`;
        }
        
        if (this.currentUser.role === 'admin') {
            if (adminControls) adminControls.classList.remove('hidden');
            if (exportControls) exportControls.classList.remove('hidden');
            this.populateNurseSelect();
        }
        
        this.renderCalendar();
        this.updateWeekTitle();
    }

    populateNurseSelect() {
        const select = document.getElementById('nurseSelect');
        if (!select) return;
        
        select.innerHTML = '<option value="">📋 Select Nurse</option>';
        this.nurses.forEach(nurse => {
            const option = document.createElement('option');
            option.value = nurse;
            option.textContent = nurse;
            select.appendChild(option);
        });
    }

    logout() {
        this.currentUser = null;
        document.getElementById('loginForm').reset();
        this.showLoginModal();
    }

    getWeekDates() {
        const start = new Date(this.currentWeek);
        start.setDate(start.getDate() - start.getDay() + 1);
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            dates.push(date);
        }
        return dates;
    }

    updateWeekTitle() {
        const dates = this.getWeekDates();
        const startDate = dates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const endDate = dates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const title = document.getElementById('weekTitle');
        if (title) title.textContent = `${startDate} - ${endDate}, ${dates[0].getFullYear()}`;
    }

    prevWeek() {
        this.currentWeek.setDate(this.currentWeek.getDate() - 7);
        this.renderCalendar();
        this.updateWeekTitle();
    }

    nextWeek() {
        this.currentWeek.setDate(this.currentWeek.getDate() + 7);
        this.renderCalendar();
        this.updateWeekTitle();
    }

    loadSchedules() {
        try {
            return JSON.parse(localStorage.getItem('nurseSchedules') || '{}');
        } catch (e) {
            return {};
        }
    }

    saveSchedules() {
        localStorage.setItem('nurseSchedules', JSON.stringify(this.schedules));
    }

    getScheduleForDate(nurse, date) {
        const key = `${nurse}_${date.toISOString().split('T')[0]}`;
        return this.schedules[key];
    }

    addShift() {
        const nurse = document.getElementById('nurseSelect').value;
        const shiftSelect = document.getElementById('shiftType');
        if (!nurse) {
            alert('❌ Please select a nurse first!');
            return;
        }
        if (!shiftSelect) return;

        const shiftType = shiftSelect.value;
        const dates = this.getWeekDates();
        
        dates.forEach(date => {
            const key = `${nurse}_${date.toISOString().split('T')[0]}`;
            this.schedules[key] = shiftType.charAt(0).toUpperCase() + shiftType.slice(1);
        });

        this.saveSchedules();
        this.renderCalendar();
        alert(`✅ ${nurse} assigned ${shiftType.toUpperCase()} shifts for the week!`);
    }

    clearWeek() {
        const nurse = document.getElementById('nurseSelect').value;
        if (!nurse) {
            alert('❌ Please select a nurse first!');
            return;
        }

        if (!confirm(`🗑️ Clear all shifts for ${nurse}?`)) return;

        const dates = this.getWeekDates();
        dates.forEach(date => {
            const key = `${nurse}_${date.toISOString().split('T')[0]}`;
            delete this.schedules[key];
        });

        this.saveSchedules();
        this.renderCalendar();
        alert(`✅ ${nurse}'s week cleared!`);
    }

    renderCalendar() {
        const dates = this.getWeekDates();
        const grid = document.querySelector('.calendar-grid');
        const selectedNurse = document.getElementById('nurseSelect')?.value || '';

        if (!grid) return;

        // Remove existing days (keep headers)
        grid.querySelectorAll('.calendar-day').forEach(day => day.remove());

        dates.forEach(date => {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day';
            dayDiv.dataset.date = date.toISOString().split('T')[0];

            let shift = null;
            if (selectedNurse) {
                shift = this.getScheduleForDate(selectedNurse, date);
            }

            const shiftDisplay = shift ? 
                `<div class="shift-info ${shift.toLowerCase()}"><i class="fas fa-clock"></i> ${shift}</div>` : 
                '<div class="shift-info unassigned">No Shift Assigned</div>';

            const dateStr = date.toLocaleDateString('en-US', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
            });

            dayDiv.innerHTML = `
                <div class="day-date">${dateStr}</div>
                ${shiftDisplay}
            `;

            if (shift) {
                dayDiv.classList.add(shift.toLowerCase());
            }

            grid.appendChild(dayDiv);
        });
    }

    // Export Functions (Simplified - No external libraries needed)
    exportCSV() {
        const weekData = this.getCurrentWeekData();
        let csv = 'Nurse,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday\n';
        
        this.nurses.forEach(nurse => {
            const row = [nurse];
            const dates = this.getWeekDates();
            dates.forEach(date => {
                const dateKey = date.toISOString().split('T')[0];
                row.push(weekData.data[nurse][dateKey] || 'Unassigned');
            });
            csv += `"${row.join('","')}"\n`;
        });

        this.downloadFile(csv, `nurse-schedule_${weekData.weekStart}_to_${weekData.weekEnd}.csv`, 'text/csv');
    }

    exportJSON() {
        const data = this.getCurrentWeekData();
        const json = JSON.stringify(data, null, 2);
        this.downloadFile(json, `nurse-schedule_${data.weekStart}_to_${data.weekEnd}.json`, 'application/json');
    }

    exportPDF() {
        alert('📄 PDF Export: Copy calendar or use CSV/JSON for now!\n\n(Full PDF needs extra libraries)');
        this.exportTextSummary();
    }

    getCurrentWeekData() {
        const dates = this.getWeekDates();
        const weekData = {};
        
        this.nurses.forEach(nurse => {
            weekData[nurse] = {};
            dates.forEach(date => {
                const dateKey = date.toISOString().split('T')[0];
                weekData[nurse][dateKey] = this.getScheduleForDate(nurse, date) || 'Unassigned';
            });
        });
        
        return {
            weekStart: dates[0].toISOString().split('T')[0],
            weekEnd: dates[6].toISOString().split('T')[0],
            generatedAt: new Date().toISOString(),
            data: weekData
        };
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    showWeeklySummary() {
        const summary = this.calculateWeeklySummary();
        const modal = document.createElement('div');
        modal.className = 'summary-modal';
        modal.innerHTML = `
            <div class="summary-content">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2>📊 Weekly Summary</h2>
                    <button onclick="this.closest('.summary-modal').remove()" style="background:none;border:none;font-size:24px;cursor:pointer;">×</button>
                </div>
                <div style="background:#f0f9ff;padding:20px;border-radius:8px;margin-bottom:20px;">
                    <h3>📈 Statistics</h3>
                    <p><strong>Total Shifts:</strong> ${summary.totalShifts}</p>
                    <p>Morning: ${summary.shiftsByType.morning} | Afternoon: ${summary.shiftsByType.afternoon} | Night: ${summary.shiftsByType.night}</p>
                </div>
                <button onclick="nurseSystem.exportCSV()" style="background:#10b981;color:white;padding:10px 20px;border:none;border-radius:6px;cursor:pointer;margin-right:10px;">📥 Download CSV</button>
                <button onclick="this.closest('.summary-modal').remove()" style="background:#6b7280;color:white;padding:10px 20px;border:none;border-radius:6px;cursor:pointer;">Close</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    calculateWeeklySummary() {
        const weekData = this.getCurrentWeekData();
        const summary = {
            totalShifts: 0,
            shiftsByType: { morning: 0, afternoon: 0, night: 0, off: 0 }
        };

        Object.values(weekData.data).forEach(nurseShifts => {
            Object.values(nurseShifts).forEach(shift => {
                if (shift === 'Morning') summary.shiftsByType.morning++;
                else if (shift === 'Afternoon') summary.shiftsByType.afternoon++;
                else if (shift === 'Night') summary.shiftsByType.night++;
                else if (shift === 'Day Off') summary.shiftsByType.off++;
            });
        });

        summary.totalShifts = summary.shiftsByType.morning + summary.shiftsByType.afternoon + summary.shiftsByType.night;
        return summary;
    }
}

