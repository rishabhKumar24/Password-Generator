const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyMsg = document.querySelector("[data-copyMsg]");
const copyBtn = document.querySelector("[data-copy]");
const upperCaseCheck = document.querySelector("#uppercase");
const lowerCaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allcheckBoxes = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*(){}\/<>,.?:;|+_-=[]';


let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//set strength circle color to grey
setIndicator("white");


//Set password length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = indicator.min;
    const max = indicator.max;
    indicator.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%";

};

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0 0 10px ${color}`;
};

function getRandomInteger(min, max) {
   return Math.floor(Math.random() * (max - min)) + min;
};

function generateRandomNumber() {
    return getRandomInteger(0,9);
};

function generateLowerCase() {
    return String.fromCharCode(getRandomInteger(97, 123));
};

function generateUpperCase() {
    return String.fromCharCode(getRandomInteger(65, 91));
};

function generateSymbol() {
    const random = getRandomInteger(0 ,symbols.length);
    return symbols.charAt(random);
};
function calculateStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if (upperCaseCheck.checked) {
        hasUpper = true;
    }
    if (lowerCaseCheck.checked) {
        hasLower = true;
    }
    if (numbersCheck.checked) {
        hasNumber = true;
    }
    if (symbolsCheck.checked) {
        hasSymbol = true;
    }

    if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if ((hasLower || hasUpper) && (hasNumber || hasSymbol) && passwordLength >= 6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
};

async function copyContent () {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(error) {
        copyMsg.innerText = "Failed";
    }

    //To make copy timer
    copyMsg.classList.add('active');

    setTimeout(() => {
        copyMsg.classList.remove('active');
    }, 2000);
};

function shufflePassword(password) {
    //in built Algo to shuffle password - Fisher Yates method
    //Need to pass the password in Array form
    
    //Step 1:Convert the password into an array of characters
    let arr = password.split("");
    //Step 2: Fisher-Yates Shuffle
    for (let i=arr.length-1;i > 0;i--) {
        let j = Math.floor(Math.random() * (i+1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    //Step 3: convert back to string
    return arr.join("");

}

function handleCheckBoxChange() {
    checkCount = 0;
    allcheckBoxes.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    });

    //Corner Case -> If all checkboxes are ticked
    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
};

allcheckBoxes.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

//ADD Event Listener

//Slider
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

//Copy button

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) {
        copyContent();
    }
});


//Generate Password
generateBtn.addEventListener('click', () => {
    //if none of the checkbox is selected 
    if (checkCount <= 0 ) {
        return;
    }
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    //let's start the journey to find new password

    password = "";


    let funcArr = [];

    if (upperCaseCheck.checked) {
        funcArr.push(generateUpperCase);
    }
    if (lowerCaseCheck.checked) {
        funcArr.push(generateLowerCase);
    }
    if (numbersCheck.checked) {
        funcArr.push(generateRandomNumber);
    }
    if (symbolsCheck.checked) {
        funcArr.push(generateSymbol);
    }

    //compulsory Addition in the Password Value
    for (let i=0;i<funcArr.length;i++) {
        password += funcArr[i]();
    }

    //remaining Addition in the Password Value
    for (let i=0;i<passwordLength - funcArr.length; i++) {
        let randomIndex = getRandomInteger(0, funcArr.length);
        password += funcArr[randomIndex]();
    }

    //Shuffle the password
    password = shufflePassword(password);

    //Now show the password in the display Password section
    passwordDisplay.value = password;

    //Now check the strength of the password
    calculateStrength();
    

});

