const keys = document.querySelectorAll('.key');
const display_input = document.querySelector('.display .input');
const display_output = document.querySelector('.display .output');

const operators = ["+", "-", "*", "/"];
let input = "";
let result = "";
let isOperator = false;
let lastIsOperator = false;
let lastIsEquals = false;

for (let key of keys) {
    const value = key.dataset.key;

    key.addEventListener('click', () => {
        isOperator = operators.includes(value);
        if (isOperator && (lastIsEquals || (result != "" && input == ""))) {
            input = "A";
        }
        lastIsEquals = false;
        switch (value) {
            case "clear":
                input = "";
                result = "";
                break;
            case "backspace":
                if (input.slice(-1) == "(") {
                    input = input.slice(0, -1);
                }
                input = input.slice(0, -1);
                break;
            case "=":
                result = eval(PrepareInput(input));
                lastIsEquals = true;
                break;
            case "brackets":
                let lBracketIndex = input.lastIndexOf("(");
                if (lBracketIndex <= input.lastIndexOf(")")) {
                    if(ValidateInput("(")) { 
                        if (input != "" && !lastIsOperator || input.slice(-1) == ")") {
                            input += "*"
                        }
                        input += "(";
                    }
                } else if (lBracketIndex == input.length - 1){
                    if (input.slice(-1) == "(") {
                        input = input.slice(0, -1);
                    }
                    input = input.slice(0, -1);
                } else {
                    if(ValidateInput(")")) input += ")";
                }
                break;
            default:
                if (ValidateInput(value)) {
                    input += value;
                }
        }
        lastIsOperator = isOperator;

        display_input.innerHTML = CleanInput(input);
        display_output.innerHTML = CleanOutput(result);
    })
}

function CleanInput(input) {
    let input_array = input.split("");

    for (let i = 0; i < input_array.length; i++) {
        switch(input_array[i]) {
            case "*":
                input_array[i] = ' <span class="operator">x</span> ';
                break;
            case "/":
                input_array[i] = ' <span class="operator">÷</span> ';
                break;
            case "+":
                input_array[i] = ' <span class="operator">+</span> ';
                break;
            case "-":
                input_array[i] = ' <span class="operator">-</span> ';
                break;
            case "(":
                input_array[i] = '<span class="action">(</span>';
                break;
            case ")":
                input_array[i] = '<span class="action">)</span>';
                break;
            case "%":
                input_array[i] = ' <span class="action">%</span> ';
                break;
            case "A":
                input_array[i] = ' <span class="action">[Ans]</span> ';
        }
    }

    return input_array.join("");
}

function CleanOutput(output) {
    let output_string = output.toString();
    let decimal = output_string.split(".")[1];
    output_string = output_string.split(".")[0];

    let output_array = output_string.split("");

    if (output_array.length > 3) {
        for (let i = output_array.length - 3; i > 0; i -= 3) {
            output_array.splice(i, 0, ",");
        }
    }

    if (decimal) {
        output_array.push(".");
        output_array.push(decimal);
    }

    return output_array.join("");
}

function ValidateInput(value) {
    let last_input = input.slice(-1);

    //No first input as operator
    if (input.length == 0 && isOperator) {
        return false;
    }

    //Checks for 'operator' ) or ( 'operator'
    if (value == ")" && lastIsOperator) {
        isOperator = true;
        return false;
    }
    if (last_input == "(" && (isOperator || input == "%")) {
        return false;
    }


    if (operators.includes(value)) {
        if (operators.includes(last_input)) {
            return false;
        }
    }
    return true;
}

function PrepareInput(input) {
    let input_array = input.split("");

    if (input_array[0] == "A") {
        input_array[0] = result;
        if (input_array.length >= 1 && !operators.includes(input_array[1])) {
            input_array[0] += "*";
        }
    }

    for (let i = 1; i < input_array.length; i++) {
        if (input_array[i] == "%") {
            input_array[i] = "/100";
        }
    }

    return input_array.join("");
}