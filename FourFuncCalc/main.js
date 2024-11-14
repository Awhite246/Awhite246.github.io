const keys = document.querySelectorAll('.key');
const display_input = document.querySelector('.display .input');
const display_output = document.querySelector('.display .output');

let input = "";
let result = "";

for (let key of keys) {
    const value = key.dataset.key;

    key.addEventListener('click', () => {
        switch (value) {
            case "clear":
                input = "";
                result = "";
                break;
            case "backspace":
                input = input.slice(0, -1);
                break;
            case "=":
                result = eval(PrepareInput(input));
                break;
            case "brackets":
                if (input.lastIndexOf("(") <= input.lastIndexOf(")")) {
                    input += "(";
                } else {
                    input += ")";
                }
                break;
            default:
                if (ValidateInput(value)) {
                    input += value;
                }
        }
        display_input.innerHTML = CleanInput(input);
        display_output.innerHTML = CleanOutput(result);
    })
}

function CleanInput(input) {
    let input_array = input.split("");

    for (let i = 0; i < input_array.length; i++) {
        let new_char = ''
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
                input_array[i] = '<span class="brackets">(</span>';
                break;
            case ")":
                input_array[i] = '<span class="brackets">)</span>';
                break;
            case "%":
                input_array[i] = ' <span class="percent">%</span> ';
                break;
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
    let operators = ["+", "-", "*", "/","%"];
    
    if (input.length == 0 && operators.includes(value)) {
        return false;
    }

    if (operators.includes(value) && operators.includes(last_input)) {
        return false;
    }
    return true;
}

function PrepareInput(input) {
    let input_array = input.split("");

    for (let i = 1; i < input_array.length; i++) {
        if (input_array[i] == "%") {
            input_array[i] = "/100";
        }
    }

    return input_array.join("");
}