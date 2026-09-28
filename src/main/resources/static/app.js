// App Logic for ShiftFlow Workforce Scheduling Portal

// State Management
let currentUser = null; // Stores { id, username, email, role, specialization }
let shifts = [];
let userRequests = [];
let managerPendingRequests = [];

// Base URLs
const API_AUTH = '/api/auth';
const API_SHIFTS = '/api/shifts';
const API_BOOKINGS = '/api/bookings';

// DOM Elements
const authModal = document.getElementById('auth-modal');
const btnShowLogin = document.getElementById('btn-show-login');
const btnCloseAuth = document.getElementById('btn-close-auth');
const tabLoginBtn = document.getElementById('tab-login-btn');
const tabRegisterBtn = document.getElementById('tab-register-btn');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const sidebarProfile = document.getElementById('sidebar-profile');
const toastContainer = document.getElementById('toast-container');
const shiftsContainer = document.getElementById('shifts-container');
const requestsTableBody = document.getElementById('requests-table-body');
const managerApprovalsTableBody = document.getElementById('manager-approvals-table-body');
const createShiftForm = document.getElementById('create-shift-form');
const searchShiftsInput = document.getElementById('search-shifts');
const apiStatusText = document.getElementById('api-status-text');
const indicatorEl = document.querySelector('.status-indicator');

// Navigation Tabs
const navItems = document.querySelectorAll('.nav-item');
const tabContents = document.querySelectorAll('.tab-content');

// AM/PM Time Format Helpers
function formatTimeAMPM(time24) {
    if (!time24) return '';
    let [hours, minutes] = time24.split(':').map(Number);
    if (isNaN(hours)) return time24;
    if (hours === 24) hours = 0;
    const period = hours >= 12 ? 'PM' : 'AM';
    let hours12 = hours % 12;
    if (hours12 === 0) hours12 = 12;
    const hoursStr = String(hours12).padStart(2, '0');
    const minStr = String(minutes || 0).padStart(2, '0');
    return `${hoursStr}:${minStr} ${period}`;
}

function formatShiftTimeRange(start, end) {
    return `${formatTimeAMPM(start)} - ${formatTimeAMPM(end)}`;
}

function convert12to24(time12, ampm) {
    let [hours, minutes] = time12.split(':').map(Number);
    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;
    return `${String(hours).padStart(2, '0')}:${String(minutes || 0).padStart(2, '0')}`;
}

// Mock Data for Fallback/Testing
let mockUsers = [
    { id: 1, username: 'admin', password: 'password123', email: 'admin@workplace.com', role: 'MANAGER', specialization: 'Manager' },
    { id: 2, username: 'manager', password: 'password123', email: 'manager@workplace.com', role: 'MANAGER', specialization: 'Manager' },
    { id: 3, username: 'john_emp', password: 'password123', email: 'john@workplace.com', role: 'EMPLOYEE', specialization: 'Associate' }
];

const mockShifts = [
    { id: 1, date: '2026-09-25', startTime: '08:00', endTime: '16:00', requiredRole: 'Associate', status: 'OPEN', assignedUserId: null, assignedUsername: null },
    { id: 2, date: '2026-09-25', startTime: '16:00', endTime: '24:00', requiredRole: 'Supervisor', status: 'OPEN', assignedUserId: null, assignedUsername: null },
    { id: 3, date: '2026-09-26', startTime: '08:00', endTime: '16:00', requiredRole: 'Lead Analyst', status: 'OPEN', assignedUserId: null, assignedUsername: null },
    { id: 4, date: '2026-09-26', startTime: '16:00', endTime: '24:00', requiredRole: 'Associate', status: 'OPEN', assignedUserId: null, assignedUsername: null }
];

let mockUserRequests = [];
let mockManagerApprovals = [];

// Initialize Page
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    setupDateRestrictions();
    checkApiStatus();
    loadDashboard();
});

// Enforce future date selection with pop-up alert
function setupDateRestrictions() {
    const shiftDateInput = document.getElementById('shift-date');
    if (shiftDateInput) {
        const todayStr = new Date().toISOString().split('T')[0];
        shiftDateInput.setAttribute('min', todayStr);
        shiftDateInput.addEventListener('change', (e) => {
            const selectedDate = e.target.value;
            const today = new Date().toISOString().split('T')[0];
            if (selectedDate && selectedDate < today) {
                alert("You cannot select previous days. Please choose today or a future date.");
                e.target.value = today;
            }
        });
    }
}

// Event Listeners
function setupEventListeners() {
    // Navigation Tabs
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = item.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    // Auth Modal toggle
    btnShowLogin.addEventListener('click', () => showAuthModal(true));
    btnCloseAuth.addEventListener('click', () => showAuthModal(false));

    tabLoginBtn.addEventListener('click', () => toggleAuthForm('login'));
    tabRegisterBtn.addEventListener('click', () => toggleAuthForm('register'));

    // Toggle specialization field based on role selection in register form
    const regRoleSelect = document.getElementById('reg-role');
    if (regRoleSelect) {
        regRoleSelect.addEventListener('change', (e) => {
            const specGroup = document.getElementById('group-reg-specialization');
            if (specGroup) {
                specGroup.style.display = e.target.value === 'MANAGER' ? 'none' : 'block';
            }
        });
    }

    // Forms Submit
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    createShiftForm.addEventListener('submit', handleCreateShift);

    // Search Shift filter
    if (searchShiftsInput) {
        searchShiftsInput.addEventListener('input', filterShifts);
    }
}

// Check API Connection Status
async function checkApiStatus() {
    try {
        const res = await fetch(`${API_SHIFTS}`, { method: 'GET' });
        if (res.status === 200) {
            apiStatusText.innerText = "Connected to API";
            indicatorEl.className = "status-indicator online";
            return true;
        }
    } catch (e) {
        console.warn("API Server not fully online. Operating in Dev Sandbox Mode.");
        apiStatusText.innerText = "Local Sandbox Mode";
        indicatorEl.className = "status-indicator offline";
        return false;
    }
}

// Switch tabs view
function switchTab(tabId) {
    navItems.forEach(item => {
        if (item.getAttribute('data-tab') === tabId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    tabContents.forEach(content => {
        if (content.id === `tab-${tabId}`) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });

    const titleEl = document.getElementById('current-section-title');
    const subTitleEl = document.getElementById('current-section-subtitle');

    if (tabId === 'dashboard') {
        titleEl.innerText = "Dashboard Overview";
        subTitleEl.innerText = "Real-time shift management and updates.";
        loadDashboard();
    } else if (tabId === 'shifts') {
        titleEl.innerText = "Available Roster Slots";
        subTitleEl.innerText = currentUser && currentUser.role === 'EMPLOYEE' && currentUser.specialization
            ? `Showing roster slots strictly for your specialization (${currentUser.specialization}).`
            : "Explore open slots matching your specialization.";
        loadShifts();
    } else if (tabId === 'requests') {
        titleEl.innerText = "My Booking Requests";
        subTitleEl.innerText = "Track history, cancellations, and status gates.";
        loadRequests();
    } else if (tabId === 'manager') {
        titleEl.innerText = "Manager Administration Console";
        subTitleEl.innerText = "Define shift parameters, review booking & cancellation approvals.";
        loadManagerDashboard();
    }
}

// Auth Modal operations
function showAuthModal(show) {
    authModal.style.display = show ? 'flex' : 'none';
    if (show) {
        toggleAuthForm('login');
    }
}

function toggleAuthForm(formType) {
    if (formType === 'login') {
        tabLoginBtn.classList.add('active');
        tabRegisterBtn.classList.remove('active');
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        document.getElementById('auth-modal-title').innerText = "Sign In";
    } else {
        tabRegisterBtn.classList.add('active');
        tabLoginBtn.classList.remove('active');
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        document.getElementById('auth-modal-title').innerText = "Create Account";
    }
}

// Toast Notifications Helper
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fa-solid ${type === 'success' ? 'fa-check-circle' : 'fa-triangle-exclamation'}"></i>
        <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Handles user Login
async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    const isApiOnline = await checkApiStatus();
    if (isApiOnline) {
        try {
            const res = await fetch(`${API_AUTH}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            if (res.ok) {
                const data = await res.json();
                loginUserSession(data);
                showToast(`Successfully logged in as ${data.username}!`);
                showAuthModal(false);
                return;
            } else {
                const errText = await res.text();
                showToast(errText || "Invalid username or password", "error");
                return;
            }
        } catch (err) {
            console.error(err);
        }
    }

    // Mock Login fallback (Developer Sandbox)
    const matchedUser = mockUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (matchedUser) {
        if (matchedUser.password && matchedUser.password !== password) {
            showToast("Invalid password in sandbox mode", "error");
            return;
        }
        loginUserSession(matchedUser);
        showToast(`Logged in to sandbox as ${matchedUser.username} (${matchedUser.specialization || matchedUser.role})`);
        showAuthModal(false);
        return;
    }

    let role = 'EMPLOYEE';
    if (username.toLowerCase().includes('manager') || username.toLowerCase().includes('admin')) {
        role = 'MANAGER';
    }
    
    const mockUser = {
        id: Math.floor(Math.random() * 1000) + 1,
        username: username,
        email: `${username}@workplace.com`,
        password: password,
        role: role,
        specialization: role === 'MANAGER' ? 'Manager' : 'Associate'
    };
    mockUsers.push(mockUser);
    loginUserSession(mockUser);
    showToast(`Logged in to sandbox as ${mockUser.username}`);
    showAuthModal(false);
}

// Handles user Registration
async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const role = document.getElementById('reg-role').value;
    const specElem = document.getElementById('reg-specialization');
    const specialization = role === 'MANAGER' ? 'Manager' : (specElem ? specElem.value : 'Associate');

    const isApiOnline = await checkApiStatus();
    if (isApiOnline) {
        try {
            const res = await fetch(`${API_AUTH}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, role, specialization })
            });
            if (res.ok) {
                showToast("Account created successfully! Please Login.");
                toggleAuthForm('login');
                document.getElementById('login-username').value = username;
                return;
            } else {
                const errText = await res.text();
                showToast(errText || "Registration failed", "error");
                return;
            }
        } catch (err) {
            console.error(err);
        }
    }

    // Mock register success in sandbox
    const existing = mockUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (existing) {
        showToast("Username already registered", "error");
        return;
    }

    const newMockUser = {
        id: Math.floor(Math.random() * 1000) + 10,
        username: username,
        email: email,
        password: password,
        role: role.toUpperCase(),
        specialization: specialization
    };
    mockUsers.push(newMockUser);
    showToast(`Account created for ${specialization}! Switching to Login tab.`);
    toggleAuthForm('login');
    document.getElementById('login-username').value = username;
}

// Store User Session
function loginUserSession(user) {
    currentUser = user;
    const userRole = (user.role || 'EMPLOYEE').toUpperCase();
    const userSpec = user.specialization || (userRole === 'MANAGER' ? 'Manager' : 'Associate');
    currentUser.specialization = userSpec;
    
    // Render profile in sidebar
    sidebarProfile.innerHTML = `
        <div class="active-profile">
            <div class="user-avatar">${user.username.charAt(0).toUpperCase()}</div>
            <div class="user-details">
                <span class="user-name">${user.username}</span>
                <span class="user-role-tag">${userRole} (${userSpec})</span>
            </div>
            <button class="btn-close" id="btn-logout" title="Log Out"><i class="fa-solid fa-sign-out-alt"></i></button>
        </div>
    `;

    document.getElementById('btn-logout').addEventListener('click', logoutSession);

    // Show manager tab if appropriate
    const managerNavItem = document.querySelector('.nav-item.manager-only');
    if (userRole === 'MANAGER') {
        managerNavItem.style.display = 'flex';
    } else {
        managerNavItem.style.display = 'none';
    }

    switchTab('dashboard');
}

// Logout
function logoutSession() {
    currentUser = null;
    sidebarProfile.innerHTML = `
        <div class="guest-profile">
            <p>Not Logged In</p>
            <button class="btn btn-sm btn-outline" id="btn-show-login">Login</button>
        </div>
    `;
    document.getElementById('btn-show-login').addEventListener('click', () => showAuthModal(true));
    
    document.querySelector('.nav-item.manager-only').style.display = 'none';
    showToast("Logged out successfully");
    switchTab('dashboard');
}

// Load Dashboard counters & state
async function loadDashboard() {
    let activeShifts = 0;
    let confirmedCount = 0;

    const isApiOnline = await checkApiStatus();
    if (isApiOnline) {
        try {
            const shiftRes = await fetch(API_SHIFTS);
            if (shiftRes.ok) {
                const data = await shiftRes.json();
                shifts = data;
                activeShifts = shifts.filter(s => s.status === 'OPEN').length;
                if (currentUser) {
                    confirmedCount = shifts.filter(s => s.status === 'CONFIRMED' && s.assignedUserId === currentUser.id).length;
                }
            }
        } catch (e) {
            console.error(e);
        }
    } else {
        activeShifts = mockShifts.filter(s => s.status === 'OPEN').length;
        if (currentUser) {
            confirmedCount = mockShifts.filter(s => s.status === 'CONFIRMED' && s.assignedUserId === currentUser.id).length;
        }
    }

    document.getElementById('stat-total-shifts').innerText = activeShifts;
    document.getElementById('stat-my-bookings').innerText = confirmedCount;

    // Render 3 recent open shifts preview with 12-hour AM/PM format
    const previewContainer = document.getElementById('dashboard-shifts-preview');
    const shiftsToDisplay = isApiOnline ? shifts : mockShifts;
    
    // Filter open shifts for employee specialization if logged in as employee
    let openShifts = shiftsToDisplay.filter(s => s.status === 'OPEN');
    if (currentUser && currentUser.role === 'EMPLOYEE' && currentUser.specialization) {
        openShifts = openShifts.filter(s => s.requiredRole.toLowerCase() === currentUser.specialization.toLowerCase());
    }
    openShifts = openShifts.slice(0, 3);

    if (openShifts.length === 0) {
        previewContainer.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-calendar-xmark"></i>
                <p>No open shifts available for your role</p>
            </div>
        `;
    } else {
        previewContainer.innerHTML = openShifts.map(s => `
            <div class="shift-row-card glass-card" style="padding: 1rem; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <strong><i class="fa-solid fa-calendar"></i> ${s.date}</strong>
                    <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.25rem;">
                        <i class="fa-solid fa-clock"></i> ${formatShiftTimeRange(s.startTime, s.endTime)} | Role: <strong>${s.requiredRole}</strong>
                    </div>
                </div>
                <button class="btn btn-sm btn-primary" onclick="requestBookShift(${s.id})">Book</button>
            </div>
        `).join('');
    }
}

// Load Roster shifts
async function loadShifts() {
    shiftsContainer.innerHTML = '<div class="empty-state"><i class="fa-solid fa-spinner fa-spin"></i><p>Loading slots...</p></div>';
    
    let shiftList = [];
    const isApiOnline = await checkApiStatus();
    if (isApiOnline) {
        try {
            const res = await fetch(API_SHIFTS);
            if (res.ok) {
                shiftList = await res.json();
                shifts = shiftList;
            }
        } catch (e) {
            console.error(e);
        }
    } else {
        shiftList = mockShifts;
    }

    renderShiftsGrid(shiftList);
}

// Filter shifts by input and specialization
function filterShifts() {
    const query = searchShiftsInput ? searchShiftsInput.value.toLowerCase() : '';
    const isApiOnline = indicatorEl.classList.contains('online');
    const activeList = isApiOnline ? shifts : mockShifts;
    
    const filtered = activeList.filter(s => 
        s.date.includes(query) || s.requiredRole.toLowerCase().includes(query)
    );
    renderShiftsGrid(filtered);
}

// Render shifts board (Strict Specialization Filtering for Employees)
function renderShiftsGrid(list) {
    let displayList = list;

    // Strict Role Enforcement: Employees can ONLY view shift slots matching their specialization
    if (currentUser && currentUser.role === 'EMPLOYEE' && currentUser.specialization) {
        displayList = list.filter(s => s.requiredRole.toLowerCase() === currentUser.specialization.toLowerCase());
    }

    if (displayList.length === 0) {
        const specMsg = (currentUser && currentUser.role === 'EMPLOYEE' && currentUser.specialization)
            ? `No shift slots available for your specialization (${currentUser.specialization}).`
            : "No shift slots match your search filter.";

        shiftsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-calendar-minus"></i>
                <p>${specMsg}</p>
            </div>
        `;
        return;
    }

    shiftsContainer.innerHTML = displayList.map(s => {
        let actionBtnHtml = '';

        if (s.status === 'OPEN') {
            actionBtnHtml = `<button class="btn btn-primary btn-block" onclick="requestBookShift(${s.id})">Book Shift Slot</button>`;
        } else if (s.status === 'PENDING') {
            actionBtnHtml = `<button class="btn btn-outline btn-block" disabled>Booking Request Pending</button>`;
        } else if (s.status === 'CANCELLATION_REQUESTED') {
            actionBtnHtml = `<button class="btn btn-outline btn-block" disabled style="color: var(--warning);">Cancellation Pending Manager Approval</button>`;
        } else if (s.status === 'CONFIRMED') {
            if (currentUser && s.assignedUserId === currentUser.id) {
                actionBtnHtml = `<button class="btn btn-danger btn-block" onclick="requestCancelShift(${s.id})">Request Cancellation</button>`;
            } else {
                actionBtnHtml = `<button class="btn btn-outline btn-block" disabled>Filled by ${s.assignedUsername || 'another employee'}</button>`;
            }
        }

        return `
            <div class="card glass-card shift-card">
                <span class="shift-status-badge status-${s.status}">${s.status.replace('_', ' ')}</span>
                <div style="font-size:0.75rem; color:#10b981; margin-bottom:0.5rem; font-weight:600;"><i class="fa-solid fa-check-circle"></i> ${s.requiredRole} Specialization</div>
                <div class="shift-time">
                    <i class="fa-solid fa-clock"></i> ${formatShiftTimeRange(s.startTime, s.endTime)}
                </div>
                <div class="shift-details-rows">
                    <div class="shift-row">
                        <i class="fa-solid fa-calendar-day"></i> <span>Date: <strong>${s.date}</strong></span>
                    </div>
                    <div class="shift-row">
                        <i class="fa-solid fa-user-tag"></i> <span>Role Required: <strong>${s.requiredRole}</strong></span>
                    </div>
                </div>
                <div class="shift-actions">
                    ${actionBtnHtml}
                </div>
            </div>
        `;
    }).join('');
}

// Handle book click with specialization check
async function requestBookShift(shiftSlotId) {
    if (!currentUser) {
        showToast("Please log in to book shifts!", "error");
        showAuthModal(true);
        return;
    }

    const activeList = shifts.length > 0 ? shifts : mockShifts;
    const targetShift = activeList.find(s => s.id === shiftSlotId);

    if (targetShift && currentUser.role === 'EMPLOYEE' && currentUser.specialization) {
        if (targetShift.requiredRole.toLowerCase() !== currentUser.specialization.toLowerCase()) {
            alert(`Access Denied: You are an ${currentUser.specialization}. You cannot view or book shift slots for ${targetShift.requiredRole}.`);
            return;
        }
    }

    const isApiOnline = await checkApiStatus();
    if (isApiOnline) {
        try {
            const res = await fetch(`${API_BOOKINGS}/request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: currentUser.id, shiftSlotId })
            });
            if (res.ok) {
                showToast("Booking request submitted! Pending manager approval.");
                loadShifts();
                return;
            }
        } catch (e) {
            console.error(e);
        }
    }

    // Mock Booking flow
    if (targetShift && targetShift.status === 'OPEN') {
        targetShift.status = 'PENDING';
        
        const mockRequest = {
            id: mockUserRequests.length + 1,
            userId: currentUser.id,
            shiftSlot: targetShift,
            requestType: 'BOOK',
            status: 'PENDING',
            timestamp: new Date().toLocaleTimeString()
        };
        mockUserRequests.push(mockRequest);
        mockManagerApprovals.push(mockRequest);
        
        showToast("Booking request registered! Pending manager approval.");
        loadShifts();
    }
}

// Request Shift cancellation (Manager approval required)
async function requestCancelShift(shiftSlotId) {
    if (!currentUser) return;

    const isApiOnline = await checkApiStatus();
    if (isApiOnline) {
        try {
            const res = await fetch(`${API_BOOKINGS}/cancel-by-slot/${shiftSlotId}`, { method: 'POST' });
            if (res.ok) {
                showToast("Cancellation request submitted. Waiting for Manager approval.");
                loadShifts();
                return;
            } else {
                const errText = await res.text();
                showToast(errText || "Failed to request cancellation", "error");
                return;
            }
        } catch (e) {
            console.error(e);
        }
    }

    // Mock Cancellation flow (requires Manager Approval)
    const targetShift = mockShifts.find(s => s.id === shiftSlotId);
    if (targetShift && targetShift.status === 'CONFIRMED') {
        targetShift.status = 'CANCELLATION_REQUESTED';

        const mockRequest = {
            id: mockUserRequests.length + 1,
            userId: currentUser.id,
            shiftSlot: targetShift,
            requestType: 'CANCEL',
            status: 'PENDING',
            timestamp: new Date().toLocaleTimeString()
        };
        mockUserRequests.push(mockRequest);
        mockManagerApprovals.push(mockRequest);

        showToast("Cancellation request submitted. Pending Manager approval.");
        loadShifts();
    }
}

// Load Employee Requests Tracker
async function loadRequests() {
    if (!currentUser) {
        requestsTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">Please login to view and track request logs.</td>
            </tr>
        `;
        return;
    }

    let requestList = [];
    const isApiOnline = await checkApiStatus();
    if (isApiOnline) {
        try {
            const res = await fetch(`${API_BOOKINGS}/user/${currentUser.id}`);
            if (res.ok) {
                requestList = await res.json();
                userRequests = requestList;
            }
        } catch (e) {
            console.error(e);
        }
    } else {
        requestList = mockUserRequests.filter(r => r.userId === currentUser.id);
    }

    if (requestList.length === 0) {
        requestsTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">No scheduling requests submitted yet.</td>
            </tr>
        `;
        return;
    }

    requestsTableBody.innerHTML = requestList.map(r => `
        <tr>
            <td>#RQ-${r.id}</td>
            <td>
                <strong>${r.shiftSlot.date}</strong><br>
                <small>${formatShiftTimeRange(r.shiftSlot.startTime, r.shiftSlot.endTime)} (${r.shiftSlot.requiredRole})</small>
            </td>
            <td><span class="badge ${r.requestType === 'CANCEL' ? 'badge-warning' : ''}">${r.requestType}</span></td>
            <td>${r.timestamp || 'Just now'}</td>
            <td><span class="shift-status-badge status-${r.status}" style="position:static; display:inline-block;">${r.status}</span></td>
            <td>
                ${r.status === 'PENDING' ? `<button class="btn btn-sm btn-danger" onclick="cancelPendingRequest(${r.id})">Withdraw</button>` : 'N/A'}
            </td>
        </tr>
    `).join('');
}

// Cancel a pending booking request
async function cancelPendingRequest(requestId) {
    const isApiOnline = await checkApiStatus();
    if (isApiOnline) {
        try {
            const res = await fetch(`${API_BOOKINGS}/${requestId}/reject`, { method: 'POST' });
            if (res.ok) {
                showToast("Request withdrawn successfully.");
                loadRequests();
                return;
            }
        } catch (e) {
            console.error(e);
        }
    }

    // Mock Withdraw request
    const reqIndex = mockUserRequests.findIndex(r => r.id === requestId);
    if (reqIndex !== -1) {
        const req = mockUserRequests[reqIndex];
        req.status = 'REJECTED';
        req.shiftSlot.status = 'OPEN';
        
        mockManagerApprovals = mockManagerApprovals.filter(m => m.id !== requestId);

        showToast("Request withdrawn.");
        loadRequests();
    }
}

// Load Manager Console Dashboard
async function loadManagerDashboard() {
    let approvalList = [];
    const isApiOnline = await checkApiStatus();
    if (isApiOnline) {
        try {
            const res = await fetch(`${API_BOOKINGS}/pending`);
            if (res.ok) {
                approvalList = await res.json();
                managerPendingRequests = approvalList;
            }
        } catch (e) {
            console.error(e);
        }
    } else {
        approvalList = mockManagerApprovals.filter(a => a.status === 'PENDING');
    }

    if (approvalList.length === 0) {
        managerApprovalsTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center">No pending approvals remaining. Excellent coverage!</td>
            </tr>
        `;
        return;
    }

    managerApprovalsTableBody.innerHTML = approvalList.map(a => `
        <tr>
            <td>#RQ-${a.id}</td>
            <td>Employee ID: ${a.userId}</td>
            <td>
                <strong>${a.shiftSlot.date}</strong><br>
                <small>${formatShiftTimeRange(a.shiftSlot.startTime, a.shiftSlot.endTime)} (${a.shiftSlot.requiredRole})</small>
            </td>
            <td><span class="badge ${a.requestType === 'CANCEL' ? 'badge-warning' : ''}">${a.requestType === 'CANCEL' ? 'Cancellation Request' : 'Booking Request'}</span></td>
            <td>${a.timestamp || 'Recent'}</td>
            <td>
                <div style="display:flex; gap:0.5rem;">
                    <button class="btn btn-sm btn-primary" onclick="managerDecision(${a.id}, 'approve')">Approve ${a.requestType === 'CANCEL' ? 'Cancellation' : ''}</button>
                    <button class="btn btn-sm btn-danger" onclick="managerDecision(${a.id}, 'reject')">Reject ${a.requestType === 'CANCEL' ? 'Cancellation' : ''}</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Manager Decision Logic (Supports both Booking & Cancellation approvals)
async function managerDecision(requestId, action) {
    const isApiOnline = await checkApiStatus();
    if (isApiOnline) {
        try {
            const res = await fetch(`${API_BOOKINGS}/${requestId}/${action}`, { method: 'POST' });
            if (res.ok) {
                showToast(`Request ${action}d successfully.`);
                loadManagerDashboard();
                return;
            }
        } catch (e) {
            console.error(e);
        }
    }

    // Mock manager decision
    const appIndex = mockManagerApprovals.findIndex(a => a.id === requestId);
    if (appIndex !== -1) {
        const approval = mockManagerApprovals[appIndex];
        approval.status = action === 'approve' ? 'APPROVED' : 'REJECTED';
        
        if (approval.requestType === 'CANCEL') {
            if (action === 'approve') {
                approval.shiftSlot.status = 'OPEN';
                approval.shiftSlot.assignedUserId = null;
                approval.shiftSlot.assignedUsername = null;
            } else {
                approval.shiftSlot.status = 'CONFIRMED';
            }
        } else {
            if (action === 'approve') {
                approval.shiftSlot.status = 'CONFIRMED';
                approval.shiftSlot.assignedUserId = approval.userId;
                approval.shiftSlot.assignedUsername = `User #${approval.userId}`;
            } else {
                approval.shiftSlot.status = 'OPEN';
            }
        }

        // Sync with employee requests
        const empIndex = mockUserRequests.findIndex(r => r.id === requestId);
        if (empIndex !== -1) {
            mockUserRequests[empIndex].status = approval.status;
        }

        mockManagerApprovals.splice(appIndex, 1);

        showToast(`Request ${action}d in Sandbox mode.`);
        loadManagerDashboard();
    }
}

// Handle Create Shift Slot (With 12-hour AM/PM time dropdowns and Past Date Pop-up Alert)
async function handleCreateShift(e) {
    e.preventDefault();
    const date = document.getElementById('shift-date').value;
    const startTime12 = document.getElementById('shift-start-time').value;
    const startAmPm = document.getElementById('shift-start-ampm').value;
    const endTime12 = document.getElementById('shift-end-time').value;
    const endAmPm = document.getElementById('shift-end-ampm').value;
    const requiredRole = document.getElementById('shift-role').value;

    const todayStr = new Date().toISOString().split('T')[0];
    if (!date || date < todayStr) {
        alert("You cannot select previous days. Please choose today or a future date.");
        return;
    }

    const startTime = convert12to24(startTime12, startAmPm);
    const endTime = convert12to24(endTime12, endAmPm);

    const isApiOnline = await checkApiStatus();
    if (isApiOnline) {
        try {
            const res = await fetch(API_SHIFTS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date, startTime, endTime, requiredRole })
            });
            if (res.ok) {
                showToast("New shift slot created successfully.");
                createShiftForm.reset();
                setupDateRestrictions();
                loadManagerDashboard();
                return;
            } else {
                const errText = await res.text();
                showToast(errText || "Failed to create shift slot", "error");
                return;
            }
        } catch (e) {
            console.error(e);
        }
    }

    // Mock shift creation
    const newMockShift = {
        id: mockShifts.length + 1,
        date,
        startTime,
        endTime,
        requiredRole,
        status: 'OPEN',
        assignedUserId: null,
        assignedUsername: null
    };
    mockShifts.push(newMockShift);
    showToast("New shift slot created in Sandbox!");
    createShiftForm.reset();
    setupDateRestrictions();
    loadManagerDashboard();
}
