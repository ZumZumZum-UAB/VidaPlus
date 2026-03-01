    const App = {
        init() {
            this.setupTailwind();
            this.cacheDOM();
            this.bindEvents();
            this.initPasswordToggles();
            this.validateRegistrationForm();
        },
        setupTailwind() {
            tailwind.config = { theme: { extend: { colors: { brand: { 'primary': '#E57373', 'dark': '#5D4037', 'extralight': '#FBF6F3' } } } } };
        },
        cacheDOM() {
            this.tabs = { register: document.getElementById('tab-register'), login: document.getElementById('tab-login') };
            this.containers = { register: document.getElementById('form-register-container'), login: document.getElementById('form-login-container') };
            this.forms = { register: document.getElementById('form-register'), login: document.getElementById('form-login') };
            this.registerFields = {
                cpf: document.getElementById('cpf'),
                password: document.getElementById('password-register'),
                confirmPassword: document.getElementById('confirm-password'),
                terms: document.getElementById('terms'),
                button: document.getElementById('register-button'),
                cpfError: document.getElementById('cpf-error'),
                passwordError: document.getElementById('password-error'),
                strengthFill: document.getElementById('password-strength-fill'),
                strengthText: document.getElementById('password-strength-text')
            };
            this.successMessages = {
                register: document.getElementById('register-success'),
                login: document.getElementById('login-success')
            };
            this.buttons = {
                goToLogin: document.getElementById('go-to-login-btn')
            };
            this.phoneInput = document.getElementById('phone');
        },
        bindEvents() {
            this.tabs.register.addEventListener('click', () => this.switchTab('register'));
            this.tabs.login.addEventListener('click', () => this.switchTab('login'));
            this.buttons.goToLogin.addEventListener('click', () => this.switchTab('login'));

            Object.values(this.registerFields).forEach(field => {
                const eventType = (field.type === 'checkbox' || field.type === 'button') ? 'change' : 'input';
                field.addEventListener(eventType, () => this.validateRegistrationForm());
            });

            this.phoneInput.addEventListener('input', (e) => this.maskPhone(e));
            
            this.forms.register.addEventListener('submit', (e) => { e.preventDefault(); this.showSuccessMessage('register'); });
            this.forms.login.addEventListener('submit', (e) => { e.preventDefault(); this.showSuccessMessage('login'); });
        },
        switchTab(tabName) {
            const activeTab = this.tabs[tabName];
            const inactiveTab = tabName === 'register' ? this.tabs.login : this.tabs.register;
            
            activeTab.classList.add('active');
            inactiveTab.classList.remove('active');
            
            // Reset forms to initial state when switching tabs
            this.containers.login.classList.toggle('hidden', tabName !== 'login');
            this.containers.register.classList.toggle('hidden', tabName !== 'register');
            this.successMessages.register.classList.add('hidden');
            this.successMessages.login.classList.add('hidden');
            this.forms.register.classList.remove('hidden');
            this.forms.login.classList.remove('hidden');
        },
        showSuccessMessage(formType) {
            this.forms[formType].classList.add('hidden');
            this.successMessages[formType].classList.remove('hidden');
            
            if (formType === 'login') {
                setTimeout(() => {
                    
                    window.location.href = '../painel/index.html';
                    console.log('Redirecting to dashboard...');
                }, 2000);
            }
        },
        togglePasswordVisibility(inputId, button) {
            const input = document.getElementById(inputId);
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            button.innerHTML = isPassword ? `<i class="fa-solid fa-eye-slash"></i>` : `<i class="fa-solid fa-eye"></i>`;
        },
        initPasswordToggles() {
            document.querySelectorAll('button[onclick*="togglePasswordVisibility"]').forEach(button => {
                button.innerHTML = `<i class="fa-solid fa-eye"></i>`;
            });
        },
        validateRegistrationForm() {
            const isCpfValid = this.validaCPF(this.registerFields.cpf.value);
            this.updateCpfError(isCpfValid);
            this.checkPasswordStrength();
            const passwordsMatch = this.checkPasswordMatch();
            const termsAgreed = this.registerFields.terms.checked;
            this.registerFields.button.disabled = !(isCpfValid && passwordsMatch && termsAgreed && this.registerFields.password.value.length > 0);
        },
        validaCPF(cpf) {
            cpf = String(cpf).replace(/[^\d]+/g, '');
            if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
            let soma = 0, resto;
            for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
            resto = (soma * 10) % 11;
            if ((resto === 10) || (resto === 11)) resto = 0;
            if (resto !== parseInt(cpf.substring(9, 10))) return false;
            soma = 0;
            for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
            resto = (soma * 10) % 11;
            if ((resto === 10) || (resto === 11)) resto = 0;
            return resto === parseInt(cpf.substring(10, 11));
        },
        updateCpfError(isValid) {
            let value = this.registerFields.cpf.value;
            this.registerFields.cpf.value = value.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            if (this.registerFields.cpf.value.length === 14) {
                this.registerFields.cpfError.textContent = isValid ? 'CPF válido!' : 'CPF inválido.';
                this.registerFields.cpfError.className = isValid ? 'text-green-500 text-xs h-4 pl-1' : 'text-red-500 text-xs h-4 pl-1';
            } else { this.registerFields.cpfError.textContent = ''; }
        },
        checkPasswordStrength() {
            const password = this.registerFields.password.value;
            if (!password) {
                this.registerFields.strengthFill.style.width = '0%';
                this.registerFields.strengthText.textContent = '';
                return;
            }
            let score = 0;
            const strengthLevels = { 0: { text: "Muito Fraca", color: '#ef4444' }, 1: { text: "Fraca", color: '#ef4444' }, 2: { text: "Razoável", color: '#f59e0b' }, 3: { text: "Forte", color: '#22c55e' }, 4: { text: "Excelente", color: '#22c55e' } };
            if (password.length > 7) score++;
            if (password.match(/[a-z]/) && password.match(/[A-Z]/)) score++;
            if (password.match(/\d/)) score++;
            if (password.match(/[^a-zA-Z\d]/)) score++;
            this.registerFields.strengthFill.style.width = (score / 4) * 100 + '%';
            this.registerFields.strengthFill.style.backgroundColor = strengthLevels[score].color;
            this.registerFields.strengthText.textContent = strengthLevels[score].text;
            this.registerFields.strengthText.style.color = strengthLevels[score].color;
        },
        checkPasswordMatch() {
            const { password, confirmPassword, passwordError } = this.registerFields;
            if (password.value && confirmPassword.value) {
                if (password.value !== confirmPassword.value) {
                    passwordError.textContent = 'As senhas não coincidem.'; return false;
                }
            }
            passwordError.textContent = ''; return true;
        },
        maskPhone(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
            value = value.replace(/(\d)(\d{4})$/, '$1-$2');
            e.target.value = value.slice(0, 15);
        }
    };
    document.addEventListener('DOMContentLoaded', () => App.init());