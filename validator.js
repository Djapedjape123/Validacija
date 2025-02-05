class Validator {
    constructor(config){
        this.elementsConfig = config
        this.errors = {};

        this.generateErrorObjects();
        this.inputListener();

    }
    generateErrorObjects() {
        for (let field in this.elementsConfig){
            this.errors[field] = [];
        }
    }
    inputListener() {
        let inputSelector = this.elementsConfig;
        for(let field in inputSelector) {
            let el = document.querySelector(`input[name="${field}"]`);
            el.addEventListener('input', this.validate.bind(this));
        }
    }
    validate(e) {
        let elFields = this.elementsConfig;
        let field = e.target;
        let fieldName = field.getAttribute('name');
        let fieldValue = field.value;
        this.errors[fieldName] = [];

        if(elFields[fieldName].required){
            if(fieldValue === '') {
                this.errors[fieldName].push('polje je prazno');
            }
        }
        if(elFields[fieldName].email){
            if(!this.validateEmail(fieldValue)) {
                this.errors[fieldName].push('email neispravan');

            }
        }
        if(fieldValue.length < elFields[fieldName].minlength || fieldValue.length > elFields[fieldName].maxlength){
            this.errors[fieldName].push(`polje mora imati minimalno ${elFields[fieldName].minlength} i maksimalno ${elFields[fieldName].maxlength} karaktera`);
        }
        if(elFields[fieldName].matching){
            let matchingEl = document.querySelector(`input[name="${elFields[fieldName].matching}"]`);
            if(fieldValue !== matchingEl.value){
                this.errors[fieldName].push('Lozinke nisu iste.');
            }
            if(this.errors[fieldName].length === 0) {
                this.errors[fieldName] = [];
                this.errors[elFields[fieldName].matching] = [];
            }
        }
        this.populateErorrs(this.errors);

    }
    populateErorrs(errors){
         for(const elem of document.querySelectorAll('ul')){
            elem.remove();
         }
         for(let key of Object.keys(errors)) {
            let paramEl = document.querySelector(`input[name="${key}"]`).parentElement;
            let errorsEl = document.createElement('ul');
            paramEl.appendChild(errorsEl);

            errors[key].forEach(error =>{
                 let li = document.createElement('li');
                 li.innerText = error;

                 errorsEl.appendChild(li)
            });
            
         }
    }
    validateEmail(email){
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return true;
        }
        return false;
    }
}