// ===================== UNIQUE KEYS (TESLA) ====================
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

// ==================== UNIVERSAL MESSAGE SYSTEM ====================
function showModal(options) {
    const modal = document.getElementById('universalModal');
    const content = document.getElementById('universalModalContent');
    const icon = document.getElementById('universalIcon');
    const title = document.getElementById('universalTitle');
    const text = document.getElementById('universalText');
    const actions = document.getElementById('universalActions');

    content.classList.remove('shake');
    void content.offsetWidth;

    const type = options.type || 'info';
    const iconClass = {
        success: 'fa-check',
        error: 'fa-times',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    }[type] || 'fa-info-circle';

    icon.className = 'universal-icon ' + type;
    icon.innerHTML = '<i class="fas ' + iconClass + '"></i>';
    title.className = 'universal-title ' + type;
    title.textContent = options.title || '';
    text.textContent = options.text || '';
    actions.innerHTML = '';

    if (type === 'error' || type === 'warning') content.classList.add('shake');

    (options.buttons || []).forEach(btn => {
        const b = document.createElement('button');
        b.className = btn.style === 'outline' ? 'btn-outline' : 'btn-primary btn-block';
        b.textContent = btn.label;
        if (btn.style !== 'outline') b.style.maxWidth = '100%';
        b.onclick = () => { if (btn.action) btn.action(); };
        actions.appendChild(b);
    });

    modal.style.display = 'flex';
}

function hideModal() {
    document.getElementById('universalModal').style.display = 'none';
}

document.addEventListener('click', (e) => {
    if (e.target.id === 'universalModal') hideModal();
});

// ==================== TOAST SYSTEM ====================
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    const iconMap = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle' };
    toast.innerHTML = `<i class="fas ${iconMap[type] || 'fa-info-circle'}"></i> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 400);
    }, 2600);
}

function setButtonLoading(btn, isLoading) {
    if (!btn) return;
    if (isLoading) btn.classList.add('btn-loading');
    else btn.classList.remove('btn-loading');
}

function shakeInput(input) {
    if (!input) return;
    input.classList.add('input-error');
    setTimeout(() => input.classList.remove('input-error'), 600);
}

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

    const openLogin = () => { loginModal.style.display = 'flex'; };
    const openSignup = () => { signupModal.style.display = 'flex'; };

    // --- UPDATED: Just open login modal directly ---
    document.getElementById('navLogin').onclick = (e) => { e.preventDefault(); openLogin(); };
    document.getElementById('btnInvest').onclick = () => {
        const session = JSON.parse(localStorage.getItem(SESSION_KEY));
        if (session) { window.location.href = 'dashboard.html'; return; }
        openLogin(); // Changed from showGuestModal() to openLogin()
    };
    document.getElementById('btnShop').onclick = () => {
        const session = JSON.parse(localStorage.getItem(SESSION_KEY));
        if (session) { window.location.href = 'dashboard.html'; return; }
        openLogin(); // Changed from showGuestModal() to openLogin()
    };

    document.getElementById('closeLogin').onclick = () => loginModal.style.display = 'none';
    document.getElementById('closeSignup').onclick = () => signupModal.style.display = 'none';

    document.getElementById('menuLogin').onclick = (e) => { e.preventDefault(); closeMenu(); openLogin(); };
    document.getElementById('menuSignup').onclick = (e) => { e.preventDefault(); closeMenu(); openSignup(); };

    document.getElementById('showSignup').onclick = (e) => {
        e.preventDefault();
        loginModal.style.display = 'none';
        signupModal.style.display = 'flex';
    };

    // -------- SIGNUP --------
    document.getElementById('signupForm').onsubmit = (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('signupSubmitBtn');
        setButtonLoading(submitBtn, true);

        setTimeout(() => {
            const users = getUsers();
            const email = document.getElementById('regEmail').value.trim();
            const emailInput = document.getElementById('regEmail');

            if (users.find(u => u.email === email)) {
                setButtonLoading(submitBtn, false);
                shakeInput(emailInput);
                showModal({
                    type: 'error',
                    title: 'Email Already Exists',
                    text: "An account with this email already exists.\nPlease log in instead, or use a different email.",
                    buttons: [
                        { label: 'TRY AGAIN', style: 'primary', action: () => hideModal() },
                        { label: 'GO TO LOGIN', style: 'outline', action: () => { hideModal(); signupModal.style.display = 'none'; openLogin(); } }
                    ]
                });
                return;
            }

            users.push({
                name: document.getElementById('regName').value.trim(),
                email: email,
                password: document.getElementById('regPassword').value,
                state: document.getElementById('regState').value.trim(),
                postal: document.getElementById('regPostal').value.trim(),
                dob: document.getElementById('regDob').value,
                balance: 0, stocks: 0, invested: 0, 
                status: 'pending',
                createdAt: new Date().toISOString()
            });
            saveUsers(users);
            setButtonLoading(submitBtn, false);

            showModal({
                type: 'success',
                title: 'Account Created!',
                text: "Your account has been submitted for verification.\nOur admin team will review and approve it shortly.\n\nYou'll be able to log in once approved.",
                buttons: [
                    { label: 'GOT IT', style: 'primary', action: () => { hideModal(); signupModal.style.display = 'none'; } }
                ]
            });
        }, 600);
    };

    // -------- LOGIN (UPDATED LOGIC) --------
    document.getElementById('loginForm').onsubmit = (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('loginSubmitBtn');
        setButtonLoading(submitBtn, true);

        setTimeout(() => {
            const emailInput = document.getElementById('loginEmail');
            const passInput = document.getElementById('loginPassword');
            const enteredEmail = emailInput.value.trim();
            const enteredPass = passInput.value;
            
            const allUsers = getUsers();
            const userExists = allUsers.find(u => u.email === enteredEmail);

            setButtonLoading(submitBtn, false);

            // 1. CHECK IF USER EXISTS (The "Not a User" scenario)
            if (!userExists) {
                shakeInput(emailInput);
                shakeInput(passInput);
                showModal({
                    type: 'warning',
                    title: "You're Not a User Yet!",
                    text: "We couldn't find an account with this email.\nPlease sign up to get started with investing and shopping.",
                    buttons: [
                        { label: 'SIGN UP NOW', style: 'primary', action: () => { hideModal(); loginModal.style.display = 'none'; openSignup(); } },
                        { label: 'TRY AGAIN', style: 'outline', action: () => hideModal() }
                    ]
                });
                return;
            }

            // 2. CHECK PASSWORD
            if (userExists.password !== enteredPass) {
                shakeInput(passInput);
                showModal({
                    type: 'error',
                    title: 'Incorrect Password',
                    text: "The password you entered is incorrect.\nPlease try again.",
                    buttons: [{ label: 'TRY AGAIN', style: 'primary', action: () => hideModal() }]
                });
                return;
            }

            // 3. CHECK APPROVAL STATUS
            if (userExists.status !== 'approved') {
                showModal({
                    type: 'info',
                    title: 'Account Not Approved',
                    text: "Your account is still pending admin approval.\nYou'll be able to log in once our team verifies your account.",
                    buttons: [{ label: 'OK, GOT IT', style: 'primary', action: () => hideModal() }]
                });
                return;
            }

            // 4. SUCCESS
            localStorage.setItem(SESSION_KEY, JSON.stringify(userExists));
            showToast('Login successful. Redirecting…', 'success');
            setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
        }, 600);
    };
}

// ==================== DASHBOARD LOGIC ====================
function initDashboard() {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY));
    if (!session) {
        showModal({
            type: 'info',
            title: 'Session Expired',
            text: "You need to log in to access the dashboard.",
            buttons: [{ label: 'GO TO LOGIN', style: 'primary', action: () => { window.location.href = 'index.html'; } }]
        });
        setTimeout(() => { window.location.href = 'index.html'; }, 2000);
        return;
    }

    // ==================== LIVE TICKER ====================
    const tickerPrices = { tsla: 245.50, rivn: 15.80, lcid: 3.45, nio: 5.20, xpev: 8.10, li: 25.40, f: 12.30 };
const tickerElements = {
    tsla: { price: 'tickTsla', pct: 'tickTslaPct' },
    rivn: { price: 'tickRivn', pct: 'tickRivnPct' },
    lcid: { price: 'tickLcid', pct: 'tickLcidPct' },
    nio: { price: 'tickNio', pct: 'tickNioPct' },
    xpev: { price: 'tickXpev', pct: 'tickXpevPct' },
    li: { price: 'tickLi', pct: 'tickLiPct' },
    f: { price: 'tickF', pct: 'tickFPct' }
};

    function updateTicker() {
        Object.keys(tickerPrices).forEach(key => {
            const oldPrice = tickerPrices[key];
            const volatility = oldPrice * 0.004;
            const change = (Math.random() - 0.5) * volatility;
            const newPrice = oldPrice + change;
            const pctChange = ((newPrice - oldPrice) / oldPrice) * 100;
            tickerPrices[key] = newPrice;

            const priceEl = document.getElementById(tickerElements[key].price);
            const pctEl = document.getElementById(tickerElements[key].pct);
            if (!priceEl) return;

            priceEl.textContent = '$' + newPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const up = pctChange >= 0;
            priceEl.classList.remove('flash-up', 'flash-down');
            void priceEl.offsetWidth;
            priceEl.classList.add(up ? 'flash-up' : 'flash-down');

            if (pctEl) {
                const sign = up ? '+' : '';
                pctEl.textContent = sign + pctChange.toFixed(2) + '%';
                pctEl.className = 'tick-pct ' + (up ? 'green' : 'red');
            }
        });
    }
    setInterval(updateTicker, 3500);

    // ==================== MENU ====================
    const dashMenu = document.getElementById('dashMenu');
    const dashMenuOverlay = document.getElementById('dashMenuOverlay');
    const openDashMenu = () => { dashMenu.classList.add('open'); dashMenuOverlay.classList.add('open'); };
    const closeDashMenu = () => { dashMenu.classList.remove('open'); dashMenuOverlay.classList.remove('open'); };

    document.getElementById('dashMenuBtn').onclick = openDashMenu;
    document.getElementById('closeDashMenu').onclick = closeDashMenu;
    dashMenuOverlay.onclick = closeDashMenu;

    document.querySelectorAll('#dashMenu .side-menu-links a').forEach(link => {
        link.onclick = (e) => { e.preventDefault(); closeDashMenu(); switchTab(link.dataset.target); };
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

    // ==================== RENDER CARS ====================
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

    // ==================== CAR PURCHASE ====================
    document.getElementById('purchaseForm').onsubmit = (e) => {
        e.preventDefault();
        const carId = parseInt(document.getElementById('purchaseModal').dataset.carId);
        const car = CARS.find(c => c.id === carId);
        const s = JSON.parse(localStorage.getItem(SESSION_KEY));

        const users = getUsers();
        const userIndex = users.findIndex(u => u.email === s.email);
        if (userIndex === -1) { window.location.href = 'index.html'; return; }
        const currentUser = users[userIndex];
        const currentBalance = currentUser.balance || 0;

        if (currentBalance < car.price) {
            const shortfall = car.price - currentBalance;
            document.getElementById('purchaseModal').style.display = 'none';
            showModal({
                type: 'warning',
                title: 'Insufficient Funds',
                text:
                    `Car: ${car.name}\n` +
                    `Price: $${car.price.toLocaleString()}\n` +
                    `Your Balance: $${currentBalance.toFixed(2)}\n` +
                    `Shortfall: $${shortfall.toLocaleString()}\n\n` +
                    `Please deposit funds and try again.`,
                buttons: [
                    { label: 'GO TO DEPOSIT', style: 'primary', action: () => { hideModal(); switchTab('deposit'); } },
                    { label: 'CANCEL', style: 'outline', action: () => hideModal() }
                ]
            });
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

        document.getElementById('purchaseModal').style.display = 'none';
        showModal({
            type: 'success',
            title: 'Order Confirmed!',
            text:
                `${car.name} — $${car.price.toLocaleString()}\n` +
                `Deducted from your balance.\n\n` +
                `NEXT STEP — PAY DELIVERY FEE\n\n` +
                `To start your shipment, pay the $${DELIVERY_FEE} delivery fee to:\n` +
                `1D3FiQUNbT4aT9yUN4sWry3rFiSA8neuCQ\n\n` +
                `Then contact Customer Service to schedule delivery.`,
            buttons: [{ label: 'GOT IT', style: 'primary', action: () => hideModal() }]
        });
        updateUI();
    };

    // ==================== UPDATE UI ====================
    const updateUI = () => {
        const user = getUsers().find(u => u.email === session.email);
        if (!user) return;
        document.getElementById('userBalance').textContent = `$${(user.balance || 0).toFixed(2)}`;
        document.getElementById('userStocks').textContent = `$${(user.stocks || 0).toFixed(2)}`;
        document.getElementById('userInvested').textContent = `$${(user.invested || 0).toFixed(2)}`;
        document.getElementById('userAvatar').textContent = user.name.substring(0,2).toUpperCase();
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

        document.getElementById('profBalance').textContent = `$${(user.balance || 0).toFixed(0)}`;
        document.getElementById('profStocks').textContent = `$${(user.stocks || 0).toFixed(0)}`;
        document.getElementById('profInvested').textContent = `$${(user.invested || 0).toFixed(0)}`;
        document.getElementById('profName').textContent = user.name;
        document.getElementById('profEmail').textContent = user.email;
        document.getElementById('profState').textContent = user.state || 'N/A';
        document.getElementById('profPostal').textContent = user.postal || 'N/A';
        document.getElementById('profDob').textContent = user.dob || 'N/A';
        document.getElementById('profStatus').textContent = user.status.toUpperCase();
        document.getElementById('profStatus').className = `badge ${user.status}`;
        document.getElementById('profSince').textContent = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';

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

    document.querySelectorAll('.tab-btn').forEach(tab => { tab.onclick = () => switchTab(tab.dataset.tab); });
    document.querySelectorAll('.nav-item').forEach(item => { item.onclick = () => switchTab(item.dataset.target); });

    // ==================== LOGOUT ====================
    document.getElementById('btnLogout').onclick = () => {
        showToast('Logging out…', 'info');
        setTimeout(() => {
            localStorage.removeItem(SESSION_KEY);
            window.location.href = 'index.html';
        }, 800);
    };

    // ==================== DEPOSIT ====================
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
            shakeInput(customAmountInput);
            showModal({
                type: 'error',
                title: 'Invalid Amount',
                text: 'The minimum deposit is $100.\nPlease select or enter a valid amount.',
                buttons: [{ label: 'OK', style: 'primary', action: () => hideModal() }]
            });
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

    // ==================== STOCKS ====================
    const stocks = [
        { symbol: 'TSLA', name: 'Tesla, Inc.', price: 245.50, exchange: 'NASDAQ' },
        { symbol: 'RIVN', name: 'Rivian Automotive', price: 15.80, exchange: 'NASDAQ' },
        { symbol: 'LCID', name: 'Lucid Group', price: 3.45, exchange: 'NASDAQ' },
        { symbol: 'NIO', name: 'NIO Inc.', price: 5.20, exchange: 'NYSE' },
        { symbol: 'XPEV', name: 'XPeng Inc.', price: 8.10, exchange: 'NYSE' },
        { symbol: 'LI', name: 'Li Auto Inc.', price: 25.40, exchange: 'NASDAQ' },
        { symbol: 'F', name: 'Ford Motor Company', price: 12.30, exchange: 'NYSE' }
    ];

    document.getElementById('plansList').innerHTML = stocks.map(s => `
        <div class="plan-item">
            <div class="plan-header">
                <span class="plan-tier">${s.exchange}</span>
                <div class="plan-return">${s.symbol}<span>Stock</span></div>
            </div>
            <div class="plan-name">${s.name}</div>
            <div class="plan-price">$${s.price.toFixed(2)}<small>/ share</small></div>
            <ul class="plan-features">
                <li><i class="fas fa-check"></i> Ticker: ${s.symbol}</li>
                <li><i class="fas fa-check"></i> Exchange: ${s.exchange}</li>
                <li><i class="fas fa-check"></i> Market Order</li>
            </ul>
            <button class="plan-buy" data-name="${s.name}" data-symbol="${s.symbol}" data-price="${s.price}">BUY STOCK</button>
        </div>
    `).join('');

    const planPaymentModal = document.getElementById('planPaymentModal');

    document.querySelectorAll('.plan-buy').forEach(btn => {
        btn.onclick = () => {
            const price = parseFloat(btn.dataset.price);
            document.getElementById('planPayName').textContent = btn.dataset.name;
            document.getElementById('planPayBadge').textContent = btn.dataset.symbol;
            document.getElementById('planPayPriceDisplay').textContent = '$' + price.toFixed(2);
            planPaymentModal.dataset.pricePerShare = price;
            planPaymentModal.dataset.planName = btn.dataset.name;
            planPaymentModal.dataset.planSymbol = btn.dataset.symbol;
            const qtyInput = document.getElementById('shareQuantity');
            qtyInput.value = 1;
            document.getElementById('planPayAmount').textContent = '$' + price.toFixed(2);
            planPaymentModal.style.display = 'flex';
        };
    });

    document.getElementById('shareQuantity').addEventListener('input', function() {
        const qty = parseInt(this.value) || 0;
        const price = parseFloat(planPaymentModal.dataset.pricePerShare) || 0;
        document.getElementById('planPayAmount').textContent = '$' + (qty * price).toFixed(2);
    });

    document.getElementById('closePlanPayment').onclick = () => planPaymentModal.style.display = 'none';

    document.getElementById('btnConfirmPlanPayment').onclick = () => {
        const qty = parseInt(document.getElementById('shareQuantity').value) || 1;
        const pricePerShare = parseFloat(planPaymentModal.dataset.pricePerShare);
        const totalCost = qty * pricePerShare;
        const stockName = planPaymentModal.dataset.planName;
        const stockSymbol = planPaymentModal.dataset.planSymbol;
        const s = JSON.parse(localStorage.getItem(SESSION_KEY));

        if (qty < 1) {
            shakeInput(document.getElementById('shareQuantity'));
            showModal({
                type: 'error',
                title: 'Invalid Quantity',
                text: 'Please enter at least 1 share.',
                buttons: [{ label: 'OK', style: 'primary', action: () => hideModal() }]
            });
            return;
        }

        const planRequests = getPlanRequests();
        planRequests.push({
            id: Date.now(), userEmail: s.email, userName: s.name,
            planName: `${stockName} (${stockSymbol}) - ${qty} shares`,
            amount: totalCost,
            status: 'pending', requestedAt: new Date().toISOString()
        });
        savePlanRequests(planRequests);
        planPaymentModal.style.display = 'none';

        showModal({
            type: 'success',
            title: 'Stock Purchase Submitted',
            text:
                `${qty} share${qty > 1 ? 's' : ''} of ${stockName} (${stockSymbol})\n` +
                `Total Cost: $${totalCost.toFixed(2)}\n\n` +
                `Send payment to:\n1D3FiQUNbT4aT9yUN4sWry3rFiSA8neuCQ\n\n` +
                `Your order will be executed once the admin confirms your payment.`,
            buttons: [{ label: 'GOT IT', style: 'primary', action: () => hideModal() }]
        });
    };
}

// ==================== COPY HELPERS ====================
function copyAddress() {
    const el = document.getElementById('btcAddress');
    navigator.clipboard.writeText(el.innerText).then(() => {
        showToast('Wallet address copied', 'success');
    });
}

function copyPlanAddress() {
    const el = document.getElementById('planBtcAddress');
    navigator.clipboard.writeText(el.innerText).then(() => {
        showToast('Wallet address copied', 'success');
    });
}
