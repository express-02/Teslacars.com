// ===================== FIREBASE + UNIQUE KEYS (TESLA) ====================

const USERS_KEY = 'teslaUsers';
const SESSION_KEY = 'teslaSession';
const DEPOSIT_KEY = 'teslaDepositRequests';
const CAR_ORDERS_KEY = 'teslaCarOrders';
const PLANS_KEY = 'teslaPlanRequests';

const firebaseConfig = {
    apiKey: "AIzaSyAueqbCcGN_LKDTd6YnPkPcWSIufFqsqwM",
    authDomain: "fedex-4bdba.firebaseapp.com",
    projectId: "fedex-4bdba"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();


// ===================== FIREBASE DATA HELPERS ====================

// Get all users from Firestore
async function getUsers() {
    const snapshot = await db.collection('users').get();

    return snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
    }));
}


// Get one user by Firebase UID
async function getUserByUid(uid) {
    if (!uid) return null;

    const doc = await db.collection('users').doc(uid).get();

    if (!doc.exists) return null;

    return {
        uid: doc.id,
        ...doc.data()
    };
}


// Get one user by email
async function getUserByEmail(email) {
    const snapshot = await db
        .collection('users')
        .where('email', '==', email)
        .limit(1)
        .get();

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];

    return {
        uid: doc.id,
        ...doc.data()
    };
}


// Save/update user
async function saveUser(user) {
    if (!user || !user.uid) {
        throw new Error('Invalid user data.');
    }

    const cleanUser = { ...user };

    delete cleanUser.uid;
    delete cleanUser.password;

    await db
        .collection('users')
        .doc(user.uid)
        .set(cleanUser, { merge: true });

    return {
        uid: user.uid,
        ...cleanUser
    };
}


// Get deposits
async function getDeposits() {
    const snapshot = await db.collection('depositRequests').get();

    return snapshot.docs.map(doc => ({
        firestoreId: doc.id,
        ...doc.data()
    }));
}


// Save a deposit
async function saveDeposit(deposit) {
    const firestoreId = deposit.firestoreId || String(deposit.id);

    const data = { ...deposit };
    delete data.firestoreId;

    await db
        .collection('depositRequests')
        .doc(firestoreId)
        .set(data, { merge: true });
}


// Get car orders
async function getCarOrders() {
    const snapshot = await db.collection('carOrders').get();

    return snapshot.docs.map(doc => ({
        firestoreId: doc.id,
        ...doc.data()
    }));
}


// Save car order
async function saveCarOrder(order) {
    const firestoreId = order.firestoreId || String(order.id);

    const data = { ...order };
    delete data.firestoreId;

    await db
        .collection('carOrders')
        .doc(firestoreId)
        .set(data, { merge: true });
}


// Get stock/plan requests
async function getPlanRequests() {
    const snapshot = await db.collection('planRequests').get();

    return snapshot.docs.map(doc => ({
        firestoreId: doc.id,
        ...doc.data()
    }));
}


// Save stock/plan request
async function savePlanRequest(plan) {
    const firestoreId = plan.firestoreId || String(plan.id);

    const data = { ...plan };
    delete data.firestoreId;

    await db
        .collection('planRequests')
        .doc(firestoreId)
        .set(data, { merge: true });
}


// Wait for Firebase Authentication
function waitForAuthUser() {
    return new Promise(resolve => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            unsubscribe();
            resolve(user);
        });
    });
}


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

    if (type === 'error' || type === 'warning') {
        content.classList.add('shake');
    }

    (options.buttons || []).forEach(btn => {
        const b = document.createElement('button');

        b.className =
            btn.style === 'outline'
                ? 'btn-outline'
                : 'btn-primary btn-block';

        b.textContent = btn.label;

        if (btn.style !== 'outline') {
            b.style.maxWidth = '100%';
        }

        b.onclick = () => {
            if (btn.action) btn.action();
        };

        actions.appendChild(b);
    });

    modal.style.display = 'flex';
}


function hideModal() {
    const modal = document.getElementById('universalModal');

    if (modal) {
        modal.style.display = 'none';
    }
}


document.addEventListener('click', (e) => {
    if (e.target.id === 'universalModal') {
        hideModal();
    }
});


// ==================== TOAST SYSTEM ====================

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');

    if (!container) return;

    const toast = document.createElement('div');

    toast.className = 'toast ' + type;

    const iconMap = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        info: 'fa-info-circle'
    };

    toast.innerHTML =
        `<i class="fas ${iconMap[type] || 'fa-info-circle'}"></i>
         <span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');

        setTimeout(() => toast.remove(), 400);
    }, 2600);
}


function setButtonLoading(btn, isLoading) {
    if (!btn) return;

    if (isLoading) {
        btn.classList.add('btn-loading');
    } else {
        btn.classList.remove('btn-loading');
    }
}


function shakeInput(input) {
    if (!input) return;

    input.classList.add('input-error');

    setTimeout(() => {
        input.classList.remove('input-error');
    }, 600);
}


// ==================== CAR DATA ====================

const CARS = [
    {
        id: 1,
        name: 'Model 3 Standard',
        price: 38630,
        img: 'https://raw.githubusercontent.com/express-02/Image-/refs/heads/main/IMG_4962.jpeg'
    },
    {
        id: 2,
        name: 'Model 3 Premium',
        price: 44130,
        img: 'https://raw.githubusercontent.com/express-02/Image-/refs/heads/main/IMG_4963.jpeg'
    },
    {
        id: 3,
        name: 'Model 3 Performance',
        price: 56630,
        img: 'https://raw.githubusercontent.com/express-02/Image-/refs/heads/main/IMG_4964.jpeg'
    },
    {
        id: 4,
        name: 'Model Y',
        price: 45000,
        img: 'https://raw.githubusercontent.com/express-02/Image-/refs/heads/main/IMG_4965.jpeg'
    },
    {
        id: 5,
        name: 'Model Y Long Range',
        price: 45000,
        img: 'https://raw.githubusercontent.com/express-02/Image-/refs/heads/main/IMG_4966.jpeg'
    },
    {
        id: 6,
        name: 'Model Y Performance',
        price: 55000,
        img: 'https://raw.githubusercontent.com/express-02/Image-/refs/heads/main/IMG_4967.jpeg'
    },
    {
        id: 7,
        name: 'Cybertruck AWD',
        price: 80000,
        img: 'https://raw.githubusercontent.com/express-02/Image-/refs/heads/main/IMG_4968.jpeg'
    },
    {
        id: 8,
        name: 'Cybertruck Cyberbeast',
        price: 112000,
        img: 'https://raw.githubusercontent.com/express-02/Image-/refs/heads/main/IMG_4969.jpeg'
    },
    {
        id: 9,
        name: 'Model S Plaid',
        price: 96000,
        img: 'https://raw.githubusercontent.com/express-02/Image-/refs/heads/main/IMG_4975.jpeg'
    },
    {
        id: 10,
        name: 'Model X Plaid',
        price: 90000,
        img: 'https://raw.githubusercontent.com/express-02/Image-/refs/heads/main/IMG_4971.jpeg'
    },
    {
        id: 11,
        name: 'Model Y L',
        price: 60000,
        img: 'https://raw.githubusercontent.com/express-02/Image-/refs/heads/main/IMG_4965.jpeg'
    },
    {
        id: 12,
        name: 'Cybercab',
        price: 29000,
        img: 'https://raw.githubusercontent.com/express-02/Image-/refs/heads/main/IMG_4973.jpeg'
    }
];

const DELIVERY_FEE = 800;


// ==================== LANDING PAGE LOGIC ====================

if (document.getElementById('investHero')) {

    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');

    const sideMenu = document.getElementById('sideMenu');
    const menuOverlay = document.getElementById('menuOverlay');

    const openMenu = () => {
        sideMenu.classList.add('open');
        menuOverlay.classList.add('open');
    };

    const closeMenu = () => {
        sideMenu.classList.remove('open');
        menuOverlay.classList.remove('open');
    };

    document.getElementById('navMenu').onclick = (e) => {
        e.preventDefault();
        openMenu();
    };

    document.getElementById('closeMenu').onclick = closeMenu;
    menuOverlay.onclick = closeMenu;

    const openLogin = () => {
        loginModal.style.display = 'flex';
    };

    const openSignup = () => {
        signupModal.style.display = 'flex';
    };


    // -------- NAVIGATION --------

    document.getElementById('navLogin').onclick = (e) => {
        e.preventDefault();
        openLogin();
    };


    document.getElementById('btnInvest').onclick = () => {
        const session = JSON.parse(localStorage.getItem(SESSION_KEY));

        if (session) {
            window.location.href = 'dashboard.html';
            return;
        }

        openLogin();
    };


    document.getElementById('btnShop').onclick = () => {
        const session = JSON.parse(localStorage.getItem(SESSION_KEY));

        if (session) {
            window.location.href = 'dashboard.html';
            return;
        }

        openLogin();
    };


    document.getElementById('closeLogin').onclick = () => {
        loginModal.style.display = 'none';
    };

    document.getElementById('closeSignup').onclick = () => {
        signupModal.style.display = 'none';
    };


    document.getElementById('menuLogin').onclick = (e) => {
        e.preventDefault();
        closeMenu();
        openLogin();
    };


    document.getElementById('menuSignup').onclick = (e) => {
        e.preventDefault();
        closeMenu();
        openSignup();
    };


    document.getElementById('showSignup').onclick = (e) => {
        e.preventDefault();

        loginModal.style.display = 'none';
        signupModal.style.display = 'flex';
    };


    // ==================== SIGNUP ====================

    document.getElementById('signupForm').onsubmit = async (e) => {

        e.preventDefault();

        const submitBtn = document.getElementById('signupSubmitBtn');

        setButtonLoading(submitBtn, true);

        const email = document
            .getElementById('regEmail')
            .value
            .trim();

        const emailInput = document.getElementById('regEmail');

        const password =
            document.getElementById('regPassword').value;


        try {

            // Create Firebase Authentication account
            const credential =
                await auth.createUserWithEmailAndPassword(
                    email,
                    password
                );


            // Create customer profile in Firestore
            const userData = {

                name: document
                    .getElementById('regName')
                    .value
                    .trim(),

                email: email,

                state: document
                    .getElementById('regState')
                    .value
                    .trim(),

                postal: document
                    .getElementById('regPostal')
                    .value
                    .trim(),

                dob: document
                    .getElementById('regDob')
                    .value,

                balance: 0,

                stocks: 0,

                invested: 0,

                status: 'pending',

                createdAt: new Date().toISOString()

            };


            await db
                .collection('users')
                .doc(credential.user.uid)
                .set(userData);


            // Never store password in Firestore/localStorage
            localStorage.removeItem(SESSION_KEY);


            // Sign out because admin approval is required
            await auth.signOut();


            setButtonLoading(submitBtn, false);


            showModal({

                type: 'success',

                title: 'Account Created!',

                text:
                    "Your account has been submitted for verification.\n" +
                    "Our admin team will review and approve it shortly.\n\n" +
                    "You'll be able to log in once approved.",

                buttons: [

                    {
                        label: 'GOT IT',
                        style: 'primary',

                        action: () => {

                            hideModal();

                            signupModal.style.display = 'none';

                        }

                    }

                ]

            });


        } catch (error) {

            console.error('SIGNUP ERROR:', error);

            setButtonLoading(submitBtn, false);


            if (error.code === 'auth/email-already-in-use') {

                shakeInput(emailInput);

                showModal({

                    type: 'error',

                    title: 'Email Already Exists',

                    text:
                        "An account with this email already exists.\n" +
                        "Please log in instead, or use a different email.",

                    buttons: [

                        {
                            label: 'TRY AGAIN',
                            style: 'primary',
                            action: () => hideModal()
                        },

                        {
                            label: 'GO TO LOGIN',
                            style: 'outline',

                            action: () => {

                                hideModal();

                                signupModal.style.display = 'none';

                                openLogin();

                            }

                        }

                    ]

                });

                return;
            }


            if (error.code === 'auth/weak-password') {

                shakeInput(
                    document.getElementById('regPassword')
                );

                showModal({

                    type: 'error',

                    title: 'Password Too Weak',

                    text:
                        'Please use a stronger password and try again.',

                    buttons: [
                        {
                            label: 'TRY AGAIN',
                            style: 'primary',
                            action: () => hideModal()
                        }
                    ]

                });

                return;
            }


            showModal({

                type: 'error',

                title: 'Signup Error',

                text:
                    'We could not create your account.\n' +
                    'Please check your information and try again.',

                buttons: [
                    {
                        label: 'TRY AGAIN',
                        style: 'primary',
                        action: () => hideModal()
                    }
                ]

            });

        }

    };


    // ==================== LOGIN ====================

    document.getElementById('loginForm').onsubmit = async (e) => {

        e.preventDefault();

        const submitBtn =
            document.getElementById('loginSubmitBtn');

        setButtonLoading(submitBtn, true);


        const emailInput =
            document.getElementById('loginEmail');

        const passInput =
            document.getElementById('loginPassword');

        const enteredEmail =
            emailInput.value.trim();

        const enteredPass =
            passInput.value;


        try {

            // Firebase checks email + password
            const credential =
                await auth.signInWithEmailAndPassword(
                    enteredEmail,
                    enteredPass
                );


            // Get matching Firestore customer
            const user =
                await getUserByUid(credential.user.uid);


            if (!user) {

                await auth.signOut();

                setButtonLoading(submitBtn, false);

                showModal({

                    type: 'warning',

                    title: "You're Not a User Yet!",

                    text:
                        "We couldn't find your customer profile.\n" +
                        "Please sign up again.",

                    buttons: [
                        {
                            label: 'OK',
                            style: 'primary',
                            action: () => hideModal()
                        }
                    ]

                });

                return;
            }


            // Approval check
            if (user.status !== 'approved') {

                await auth.signOut();

                setButtonLoading(submitBtn, false);

                showModal({

                    type: 'info',

                    title: 'Account Not Approved',

                    text:
                        "Your account is still pending admin approval.\n" +
                        "You'll be able to log in once our team verifies your account.",

                    buttons: [
                        {
                            label: 'OK, GOT IT',
                            style: 'primary',
                            action: () => hideModal()
                        }
                    ]

                });

                return;
            }


            // Session contains profile only.
            // NEVER store password here.
            localStorage.setItem(
                SESSION_KEY,
                JSON.stringify(user)
            );


            setButtonLoading(submitBtn, false);

            showToast(
                'Login successful. Redirecting…',
                'success'
            );


            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 800);


        } catch (error) {

            console.error('LOGIN ERROR:', error);

            setButtonLoading(submitBtn, false);


            if (
                error.code === 'auth/user-not-found' ||
                error.code === 'auth/invalid-credential'
            ) {

                shakeInput(emailInput);
                shakeInput(passInput);

                showModal({

                    type: 'warning',

                    title: "You're Not a User Yet!",

                    text:
                        "We couldn't find an account with this email.\n" +
                        "Please sign up to get started.",

                    buttons: [

                        {
                            label: 'SIGN UP NOW',
                            style: 'primary',

                            action: () => {

                                hideModal();

                                loginModal.style.display = 'none';

                                openSignup();

                            }

                        },

                        {
                            label: 'TRY AGAIN',
                            style: 'outline',
                            action: () => hideModal()
                        }

                    ]

                });

                return;
            }


            if (error.code === 'auth/wrong-password') {

                shakeInput(passInput);

                showModal({

                    type: 'error',

                    title: 'Incorrect Password',

                    text:
                        "The password you entered is incorrect.\n" +
                        "Please try again.",

                    buttons: [

                        {
                            label: 'TRY AGAIN',
                            style: 'primary',
                            action: () => hideModal()
                        }

                    ]

                });

                return;
            }


            showModal({

                type: 'error',

                title: 'Login Error',

                text:
                    'We could not complete your login.\n' +
                    'Please try again.',

                buttons: [

                    {
                        label: 'TRY AGAIN',
                        style: 'primary',
                        action: () => hideModal()
                    }

                ]

            });

        }

    };

}


// ==================== DASHBOARD LOGIC ====================

async function initDashboard() {

    let session =
        JSON.parse(localStorage.getItem(SESSION_KEY));


    // Make sure Firebase knows who is logged in
    const firebaseUser = await waitForAuthUser();


    if (!firebaseUser) {

        localStorage.removeItem(SESSION_KEY);

        showModal({

            type: 'info',

            title: 'Session Expired',

            text:
                "You need to log in to access the dashboard.",

            buttons: [

                {
                    label: 'GO TO LOGIN',
                    style: 'primary',

                    action: () => {
                        window.location.href = 'index.html';
                    }

                }

            ]

        });

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);

        return;
    }


    // Get the latest customer information from Firebase
    const firebaseProfile =
        await getUserByUid(firebaseUser.uid);


    if (!firebaseProfile) {

        await auth.signOut();

        localStorage.removeItem(SESSION_KEY);

        window.location.href = 'index.html';

        return;
    }


    session = firebaseProfile;

    localStorage.setItem(
        SESSION_KEY,
        JSON.stringify(session)
    );


    // ==================== LIVE TICKER ====================

    const tickerPrices = {
        tsla: 245.50,
        rivn: 15.80,
        lcid: 3.45,
        nio: 5.20,
        xpev: 8.10,
        li: 25.40,
        f: 12.30
    };


    const tickerElements = {

        tsla: {
            price: 'tickTsla',
            pct: 'tickTslaPct'
        },

        rivn: {
            price: 'tickRivn',
            pct: 'tickRivnPct'
        },

        lcid: {
            price: 'tickLcid',
            pct: 'tickLcidPct'
        },

        nio: {
            price: 'tickNio',
            pct: 'tickNioPct'
        },

        xpev: {
            price: 'tickXpev',
            pct: 'tickXpevPct'
        },

        li: {
            price: 'tickLi',
            pct: 'tickLiPct'
        },

        f: {
            price: 'tickF',
            pct: 'tickFPct'
        }

    };


    function updateTicker() {

        Object.keys(tickerPrices).forEach(key => {

            const oldPrice = tickerPrices[key];

            const volatility =
                oldPrice * 0.004;

            const change =
                (Math.random() - 0.5) * volatility;

            const newPrice =
                oldPrice + change;

            const pctChange =
                ((newPrice - oldPrice) / oldPrice) * 100;

            tickerPrices[key] = newPrice;


            const priceEl =
                document.getElementById(
                    tickerElements[key].price
                );

            const pctEl =
                document.getElementById(
                    tickerElements[key].pct
                );


            if (!priceEl) return;


            priceEl.textContent =
                '$' +
                newPrice.toLocaleString(
                    undefined,
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }
                );


            const up = pctChange >= 0;


            priceEl.classList.remove(
                'flash-up',
                'flash-down'
            );

            void priceEl.offsetWidth;

            priceEl.classList.add(
                up ? 'flash-up' : 'flash-down'
            );


            if (pctEl) {

                const sign =
                    up ? '+' : '';

                pctEl.textContent =
                    sign +
                    pctChange.toFixed(2) +
                    '%';

                pctEl.className =
                    'tick-pct ' +
                    (up ? 'green' : 'red');

            }

        });

    }


    setInterval(updateTicker, 3500);


    // ==================== MENU ====================

    const dashMenu =
        document.getElementById('dashMenu');

    const dashMenuOverlay =
        document.getElementById('dashMenuOverlay');


    const openDashMenu = () => {

        dashMenu.classList.add('open');

        dashMenuOverlay.classList.add('open');

    };


    const closeDashMenu = () => {

        dashMenu.classList.remove('open');

        dashMenuOverlay.classList.remove('open');

    };


    document.getElementById('dashMenuBtn').onclick =
        openDashMenu;

    document.getElementById('closeDashMenu').onclick =
        closeDashMenu;

    dashMenuOverlay.onclick =
        closeDashMenu;


    document
        .querySelectorAll('#dashMenu .side-menu-links a')
        .forEach(link => {

            link.onclick = (e) => {

                e.preventDefault();

                closeDashMenu();

                switchTab(link.dataset.target);

            };

        });


    const switchTab = (target) => {

        document
            .querySelectorAll('.tab-content')
            .forEach(c =>
                c.classList.remove('active')
            );


        const targetElement =
            document.getElementById(`tab-${target}`);

        if (targetElement) {
            targetElement.classList.add('active');
        }


        document
            .querySelectorAll('.tab-btn')
            .forEach(t =>
                t.classList.remove('active')
            );


        const topTab =
            document.querySelector(
                `.tab-btn[data-tab="${target}"]`
            );


        if (topTab) {
            topTab.classList.add('active');
        }


        document
            .querySelectorAll('.nav-item')
            .forEach(n =>
                n.classList.remove('active')
            );


        const bottomNav =
            document.querySelector(
                `.nav-item[data-target="${target}"]`
            );


        if (bottomNav) {
            bottomNav.classList.add('active');
        }


        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

    };


    // ==================== RENDER CARS ====================

    const carGrid =
        document.getElementById('carGrid');


    if (carGrid) {

        carGrid.innerHTML =
            CARS.map(car => `

                <div class="car-card">

                    <img
                        src="${car.img}"
                        alt="${car.name}"
                    >

                    <div class="car-card-body">

                        <h4>${car.name}</h4>

                        <p class="car-price">
                            $${car.price.toLocaleString()}
                        </p>

                        <button
                            class="btn-buy"
                            data-id="${car.id}"
                        >
                            BUY NOW
                        </button>

                    </div>

                </div>

            `).join('');


        document
            .querySelectorAll('.btn-buy')
            .forEach(btn => {

                btn.onclick = () => {

                    const car =
                        CARS.find(
                            c => c.id == btn.dataset.id
                        );


                    document
                        .getElementById('purchaseCarName')
                        .textContent =
                        `${car.name} — $${car.price.toLocaleString()}`;


                    document
                        .getElementById('purchaseModal')
                        .style.display = 'flex';


                    document
                        .getElementById('purchaseModal')
                        .dataset.carId = car.id;

                };

            });

    }


    document.getElementById('closePurchase').onclick =
        () => {
            document.getElementById(
                'purchaseModal'
            ).style.display = 'none';
        };


    // ==================== CAR PURCHASE ====================

    document.getElementById('purchaseForm').onsubmit =
        async (e) => {

            e.preventDefault();


            const carId =
                parseInt(
                    document
                        .getElementById('purchaseModal')
                        .dataset.carId
                );


            const car =
                CARS.find(c => c.id === carId);


            const firebaseCustomer =
                auth.currentUser;


            if (!firebaseCustomer) {

                window.location.href =
                    'index.html';

                return;
            }


            const userRef =
                db.collection('users')
                  .doc(firebaseCustomer.uid);


            const orderId = Date.now();


            const orderRef =
                db.collection('carOrders')
                  .doc(String(orderId));


            let newBalance = 0;


            try {

                await db.runTransaction(
                    async transaction => {

                        const userSnapshot =
                            await transaction.get(
                                userRef
                            );


                        if (!userSnapshot.exists) {
                            throw new Error(
                                'USER_NOT_FOUND'
                            );
                        }


                        const currentUser =
                            userSnapshot.data();


                        const currentBalance =
                            Number(
                                currentUser.balance || 0
                            );


                        if (
                            currentBalance <
                            car.price
                        ) {

                            throw new Error(
                                'INSUFFICIENT_FUNDS'
                            );

                        }


                        newBalance =
                            currentBalance -
                            car.price;


                        transaction.update(
                            userRef,
                            {
                                balance: newBalance
                            }
                        );


                        transaction.set(
                            orderRef,
                            {

                                id: orderId,

                                userEmail:
                                    currentUser.email,

                                userName:
                                    currentUser.name,

                                userUid:
                                    firebaseCustomer.uid,

                                carId:
                                    car.id,

                                carName:
                                    car.name,

                                carPrice:
                                    car.price,

                                deliveryFee:
                                    DELIVERY_FEE,

                                buyerInfo: {

                                    name:
                                        document
                                            .getElementById('buyName')
                                            .value,

                                    phone:
                                        document
                                            .getElementById('buyPhone')
                                            .value,

                                    address:
                                        document
                                            .getElementById('buyAddress')
                                            .value,

                                    city:
                                        document
                                            .getElementById('buyCity')
                                            .value,

                                    postal:
                                        document
                                            .getElementById('buyPostal')
                                            .value

                                },

                                status:
                                    'pending_delivery',

                                purchasedAt:
                                    new Date().toISOString()

                            }

                        );

                    }
                );


                const updatedUser =
                    await getUserByUid(
                        firebaseCustomer.uid
                    );


                if (updatedUser) {

                    session =
                        updatedUser;

                    localStorage.setItem(
                        SESSION_KEY,
                        JSON.stringify(updatedUser)
                    );

                }


                document
                    .getElementById('purchaseModal')
                    .style.display = 'none';


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

                    buttons: [

                        {
                            label: 'GOT IT',
                            style: 'primary',
                            action: () => hideModal()
                        }

                    ]

                });


                await updateUI();


            } catch (error) {

                console.error(
                    'CAR PURCHASE ERROR:',
                    error
                );


                if (
                    error.message ===
                    'INSUFFICIENT_FUNDS'
                ) {

                    const currentBalance =
                        Number(
                            session.balance || 0
                        );

                    const shortfall =
                        car.price -
                        currentBalance;


                    document
                        .getElementById('purchaseModal')
                        .style.display = 'none';


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

                            {
                                label: 'GO TO DEPOSIT',
                                style: 'primary',

                                action: () => {

                                    hideModal();

                                    switchTab('deposit');

                                }

                            },

                            {
                                label: 'CANCEL',
                                style: 'outline',
                                action: () => hideModal()
                            }

                        ]

                    });

                    return;
                }


                showModal({

                    type: 'error',

                    title: 'Order Error',

                    text:
                        'We could not complete the order.\n' +
                        'Please try again.',

                    buttons: [

                        {
                            label: 'OK',
                            style: 'primary',
                            action: () => hideModal()
                        }

                    ]

                });

            }

        };


    // ==================== UPDATE UI ====================

    async function updateUI() {

        const user =
            await getUserByUid(
                firebaseCustomerUid()
            );


        if (!user) return;


        session = user;


        localStorage.setItem(
            SESSION_KEY,
            JSON.stringify(user)
        );


        document.getElementById(
            'userBalance'
        ).textContent =
            `$${(user.balance || 0).toFixed(2)}`;


        document.getElementById(
            'userStocks'
        ).textContent =
            `$${(user.stocks || 0).toFixed(2)}`;


        document.getElementById(
            'userInvested'
        ).textContent =
            `$${(user.invested || 0).toFixed(2)}`;


        document.getElementById(
            'userAvatar'
        ).textContent =
            user.name.substring(0, 2).toUpperCase();


        document.getElementById(
            'profileAvatarLarge'
        ).textContent =
            user.name.substring(0, 2).toUpperCase();


        document.getElementById(
            'heroName'
        ).textContent =
            user.name;


        document.getElementById(
            'heroEmail'
        ).textContent =
            user.email;


        const heroStatus =
            document.getElementById('heroStatus');


        if (user.status === 'approved') {

            heroStatus.className =
                'verified-badge';

            heroStatus.innerHTML =
                '<i class="fas fa-check-circle"></i> VERIFIED';

        } else if (user.status === 'pending') {

            heroStatus.className =
                'verified-badge pending';

            heroStatus.innerHTML =
                '<i class="fas fa-hourglass-half"></i> PENDING APPROVAL';

        } else {

            heroStatus.className =
                'verified-badge blocked';

            heroStatus.innerHTML =
                '<i class="fas fa-ban"></i> BLOCKED';

        }


        document.getElementById(
            'profBalance'
        ).textContent =
            `$${(user.balance || 0).toFixed(0)}`;


        document.getElementById(
            'profStocks'
        ).textContent =
            `$${(user.stocks || 0).toFixed(0)}`;


        document.getElementById(
            'profInvested'
        ).textContent =
            `$${(user.invested || 0).toFixed(0)}`;


        document.getElementById(
            'profName'
        ).textContent =
            user.name;


        document.getElementById(
            'profEmail'
        ).textContent =
            user.email;


        document.getElementById(
            'profState'
        ).textContent =
            user.state || 'N/A';


        document.getElementById(
            'profPostal'
        ).textContent =
            user.postal || 'N/A';


        document.getElementById(
            'profDob'
        ).textContent =
            user.dob || 'N/A';


        document.getElementById(
            'profStatus'
        ).textContent =
            user.status.toUpperCase();


        document.getElementById(
            'profStatus'
        ).className =
            `badge ${user.status}`;


        document.getElementById(
            'profSince'
        ).textContent =
            user.createdAt
                ? new Date(
                    user.createdAt
                ).toLocaleDateString(
                    'en-US',
                    {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }
                )
                : 'N/A';


        const orders =
            (await getCarOrders())
                .filter(
                    o =>
                        o.userEmail ===
                        user.email
                );


        const list =
            document.getElementById(
                'pendingCarsList'
            );


        if (orders.length === 0) {

            list.innerHTML =
                '<p class="small-note">No pending car deliveries.</p>';

        } else {

            list.innerHTML =
                orders.map(o => `

                    <div class="car-status-card">

                        <h4>${o.carName}</h4>

                        <p>
                            Status:
                            ${o.status.replace('_', ' ').toUpperCase()}
                        </p>

                        <p>
                            Delivery Fee:
                            $${o.deliveryFee} (pending)
                        </p>

                        <p
                            style="font-size:0.65rem; margin-top:5px;"
                        >
                            Ordered:
                            ${new Date(
                                o.purchasedAt
                            ).toLocaleDateString()}
                        </p>

                    </div>

                `).join('');

        }

    }


    function firebaseCustomerUid() {

        if (auth.currentUser) {
            return auth.currentUser.uid;
        }

        return session.uid;

    }


    await updateUI();


    // ==================== REAL-TIME CUSTOMER UPDATE ====================

    // If admin changes balance/stocks/invested/status,
    // the customer's dashboard receives the change from Firebase.

    if (firebaseCustomerUid()) {

        db.collection('users')
            .doc(firebaseCustomerUid())
            .onSnapshot(async snapshot => {

                if (!snapshot.exists) return;

                const updatedUser = {
                    uid: snapshot.id,
                    ...snapshot.data()
                };


                session = updatedUser;


                localStorage.setItem(
                    SESSION_KEY,
                    JSON.stringify(updatedUser)
                );


                await updateUI();


                if (
                    updatedUser.status === 'blocked'
                ) {

                    localStorage.removeItem(
                        SESSION_KEY
                    );

                    await auth.signOut();

                    showModal({

                        type: 'warning',

                        title: 'Account Blocked',

                        text:
                            'Your account has been blocked by the administrator.',

                        buttons: [

                            {
                                label: 'OK',
                                style: 'primary',

                                action: () => {

                                    hideModal();

                                    window.location.href =
                                        'index.html';

                                }

                            }

                        ]

                    });

                }

            });

    }


    document
        .querySelectorAll('.tab-btn')
        .forEach(tab => {

            tab.onclick = () => {
                switchTab(tab.dataset.tab);
            };

        });


    document
        .querySelectorAll('.nav-item')
        .forEach(item => {

            item.onclick = () => {
                switchTab(item.dataset.target);
            };

        });


    // ==================== LOGOUT ====================

    document.getElementById('btnLogout').onclick =
        () => {

            showToast(
                'Logging out…',
                'info'
            );


            setTimeout(async () => {

                localStorage.removeItem(
                    SESSION_KEY
                );

                await auth.signOut();

                window.location.href =
                    'index.html';

            }, 800);

        };


    // ==================== DEPOSIT ====================

    let selectedAmount = 0;

    const step1Card =
        document.getElementById('step1Card');

    const step2Card =
        document.getElementById('step2Card');

    const step3Card =
        document.getElementById('step3Card');

    const customAmountInput =
        document.getElementById('customAmount');

    const amountBtns =
        document.querySelectorAll('.amount-btn');


    amountBtns.forEach(btn => {

        btn.onclick = () => {

            amountBtns.forEach(
                b => b.classList.remove('active')
            );

            btn.classList.add('active');

            selectedAmount =
                parseInt(btn.dataset.amount);

            customAmountInput.value = '';

        };

    });


    customAmountInput.oninput = () => {

        amountBtns.forEach(
            b => b.classList.remove('active')
        );

        selectedAmount =
            parseFloat(
                customAmountInput.value
            ) || 0;

    };


    document.getElementById(
        'btnContinueDeposit'
    ).onclick = () => {

        if (
            !selectedAmount ||
            selectedAmount < 100
        ) {

            shakeInput(
                customAmountInput
            );


            showModal({

                type: 'error',

                title: 'Invalid Amount',

                text:
                    'The minimum deposit is $100.\n' +
                    'Please select or enter a valid amount.',

                buttons: [

                    {
                        label: 'OK',
                        style: 'primary',
                        action: () => hideModal()
                    }

                ]

            });

            return;

        }


        document.getElementById(
            'depositAmountDisplay'
        ).textContent =
            '$' +
            selectedAmount.toLocaleString(
                undefined,
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            );


        step1Card.style.display = 'none';

        step2Card.style.display = 'block';

        step2Card.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

    };


    document.getElementById(
        'btnBackDeposit'
    ).onclick = () => {

        step2Card.style.display = 'none';

        step1Card.style.display = 'block';

    };


    document.getElementById(
        'btnNotifyDeposit'
    ).onclick = async () => {

        const firebaseCustomer =
            auth.currentUser;


        if (!firebaseCustomer) return;


        const user =
            await getUserByUid(
                firebaseCustomer.uid
            );


        if (!user) return;


        const deposit = {

            id: Date.now(),

            userUid:
                firebaseCustomer.uid,

            name:
                user.name,

            email:
                user.email,

            amount:
                selectedAmount,

            method:
                'BTC',

            wallet:
                '1D3FiQUNbT4aT9yUN4sWry3rFiSA8neuCQ',

            status:
                'pending',

            requestedAt:
                new Date().toISOString()

        };


        try {

            await saveDeposit(
                deposit
            );


            document.getElementById(
                'successAmount'
            ).textContent =
                '$' +
                selectedAmount.toLocaleString(
                    undefined,
                    {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    }
                );


            step2Card.style.display =
                'none';

            step3Card.style.display =
                'block';


            step3Card.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });


        } catch (error) {

            console.error(
                'DEPOSIT ERROR:',
                error
            );

            showModal({

                type: 'error',

                title: 'Request Error',

                text:
                    'Your request could not be submitted. Please try again.',

                buttons: [
                    {
                        label: 'OK',
                        style: 'primary',
                        action: () => hideModal()
                    }
                ]

            });

        }

    };


    document.getElementById(
        'btnNewDeposit'
    ).onclick = () => {

        selectedAmount = 0;

        customAmountInput.value = '';

        amountBtns.forEach(
            b => b.classList.remove('active')
        );

        step3Card.style.display =
            'none';

        step1Card.style.display =
            'block';

        step1Card.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

    };


    // ==================== STOCKS ====================

    const stocks = [

        {
            symbol: 'TSLA',
            name: 'Tesla, Inc.',
            price: 245.50,
            exchange: 'NASDAQ'
        },

        {
            symbol: 'RIVN',
            name: 'Rivian Automotive',
            price: 15.80,
            exchange: 'NASDAQ'
        },

        {
            symbol: 'LCID',
            name: 'Lucid Group',
            price: 3.45,
            exchange: 'NASDAQ'
        },

        {
            symbol: 'NIO',
            name: 'NIO Inc.',
            price: 5.20,
            exchange: 'NYSE'
        },

        {
            symbol: 'XPEV',
            name: 'XPeng Inc.',
            price: 8.10,
            exchange: 'NYSE'
        },

        {
            symbol: 'LI',
            name: 'Li Auto Inc.',
            price: 25.40,
            exchange: 'NASDAQ'
        },

        {
            symbol: 'F',
            name: 'Ford Motor Company',
            price: 12.30,
            exchange: 'NYSE'
        }

    ];


    document.getElementById(
        'plansList'
    ).innerHTML = stocks.map(s => `

        <div class="plan-item">

            <div class="plan-header">

                <span class="plan-tier">
                    ${s.exchange}
                </span>

                <div class="plan-return">
                    ${s.symbol}
                    <span>Stock</span>
                </div>

            </div>

            <div class="plan-name">
                ${s.name}
            </div>

            <div class="plan-price">
                $${s.price.toFixed(2)}
                <small>/ share</small>
            </div>

            <ul class="plan-features">

                <li>
                    <i class="fas fa-check"></i>
                    Ticker: ${s.symbol}
                </li>

                <li>
                    <i class="fas fa-check"></i>
                    Exchange: ${s.exchange}
                </li>

                <li>
                    <i class="fas fa-check"></i>
                    Market Order
                </li>

            </ul>

            <button
                class="plan-buy"
                data-name="${s.name}"
                data-symbol="${s.symbol}"
                data-price="${s.price}"
            >
                BUY STOCK
            </button>

        </div>

    `).join('');


    const planPaymentModal =
        document.getElementById(
            'planPaymentModal'
        );


    document
        .querySelectorAll('.plan-buy')
        .forEach(btn => {

            btn.onclick = () => {

                const price =
                    parseFloat(
                        btn.dataset.price
                    );


                document.getElementById(
                    'planPayName'
                ).textContent =
                    btn.dataset.name;


                document.getElementById(
                    'planPayBadge'
                ).textContent =
                    btn.dataset.symbol;


                document.getElementById(
                    'planPayPriceDisplay'
                ).textContent =
                    '$' +
                    price.toFixed(2);


                planPaymentModal.dataset.pricePerShare =
                    price;


                planPaymentModal.dataset.planName =
                    btn.dataset.name;


                planPaymentModal.dataset.planSymbol =
                    btn.dataset.symbol;


                const qtyInput =
                    document.getElementById(
                        'shareQuantity'
                    );


                qtyInput.value = 1;


                document.getElementById(
                    'planPayAmount'
                ).textContent =
                    '$' +
                    price.toFixed(2);


                planPaymentModal.style.display =
                    'flex';

            };

        });


    document.getElementById(
        'shareQuantity'
    ).addEventListener(
        'input',
        function () {

            const qty =
                parseInt(this.value) || 0;


            const price =
                parseFloat(
                    planPaymentModal
                        .dataset
                        .pricePerShare
                ) || 0;


            document.getElementById(
                'planPayAmount'
            ).textContent =
                '$' +
                (qty * price).toFixed(2);

        }
    );


    document.getElementById(
        'closePlanPayment'
    ).onclick = () => {

        planPaymentModal.style.display =
            'none';

    };


    document.getElementById(
        'btnConfirmPlanPayment'
    ).onclick = async () => {

        const qty =
            parseInt(
                document.getElementById(
                    'shareQuantity'
                ).value
            ) || 1;


        const pricePerShare =
            parseFloat(
                planPaymentModal
                    .dataset
                    .pricePerShare
            );


        const totalCost =
            qty * pricePerShare;


        const stockName =
            planPaymentModal
                .dataset
                .planName;


        const stockSymbol =
            planPaymentModal
                .dataset
                .planSymbol;


        const firebaseCustomer =
            auth.currentUser;


        if (qty < 1) {

            shakeInput(
                document.getElementById(
                    'shareQuantity'
                )
            );


            showModal({

                type: 'error',

                title: 'Invalid Quantity',

                text:
                    'Please enter at least 1 share.',

                buttons: [

                    {
                        label: 'OK',
                        style: 'primary',
                        action: () => hideModal()
                    }

                ]

            });

            return;

        }


        if (!firebaseCustomer) {

            window.location.href =
                'index.html';

            return;

        }


        const user =
            await getUserByUid(
                firebaseCustomer.uid
            );


        if (!user) return;


        const planRequest = {

            id: Date.now(),

            userUid:
                firebaseCustomer.uid,

            userEmail:
                user.email,

            userName:
                user.name,

            planName:
                `${stockName} (${stockSymbol}) - ${qty} shares`,

            amount:
                totalCost,

            status:
                'pending',

            requestedAt:
                new Date().toISOString()

        };


        try {

            await savePlanRequest(
                planRequest
            );


            planPaymentModal.style.display =
                'none';


            showModal({

                type: 'success',

                title:
                    'Stock Purchase Submitted',

                text:

                    `${qty} share${qty > 1 ? 's' : ''} of ${stockName} (${stockSymbol})\n` +

                    `Total Cost: $${totalCost.toFixed(2)}\n\n` +

                    `Send payment to:\n` +

                    `1D3FiQUNbT4aT9yUN4sWry3rFiSA8neuCQ\n\n` +

                    `Your order will be executed once the admin confirms your payment.`,

                buttons: [

                    {
                        label: 'GOT IT',
                        style: 'primary',
                        action: () => hideModal()
                    }

                ]

            });


        } catch (error) {

            console.error(
                'PLAN REQUEST ERROR:',
                error
            );


            showModal({

                type: 'error',

                title: 'Request Error',

                text:
                    'Your stock request could not be submitted. Please try again.',

                buttons: [

                    {
                        label: 'OK',
                        style: 'primary',
                        action: () => hideModal()
                    }

                ]

            });

        }

    };

}


// ==================== COPY HELPERS ====================

function copyAddress() {

    const el =
        document.getElementById(
            'btcAddress'
        );


    navigator.clipboard
        .writeText(el.innerText)
        .then(() => {

            showToast(
                'Wallet address copied',
                'success'
            );

        });

}


function copyPlanAddress() {

    const el =
        document.getElementById(
            'planBtcAddress'
        );


    navigator.clipboard
        .writeText(el.innerText)
        .then(() => {

            showToast(
                'Wallet address copied',
                'success'
            );

        });

}
