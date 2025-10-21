//ALGORITHM 1: SymbolTable 
function SymbolTable() {
  // table ← empty map
  this.table = {};

  // INSERT(key, value) procedure
  this.insert = function (key, value) {
    //if key matches single uppercase letter A–Z then
    if (/^[A-Z]$/.test(key)) {
      //table[key] ← value
      this.table[key] = value;
      return true;
    }
    return false;
  };

  // SEARCH(key) procedure
  this.search = function (key) {
    //return table[key]
    return this.table[key];
  };

  // DELETE(key) procedure
  this.delete = function (key) {
    //if key exists in table then
    if (this.table.hasOwnProperty(key)) {
      //remove key from table
      delete this.table[key];
      return true;
    }
    return false;
  };

  // DISPLAY() procedure
  this.display = function () {
    //return string representation of table
    return JSON.stringify(this.table);
  };
}

// Create symbol table instance
var symbolTable = new SymbolTable();

//ALGORITHM 2: Evaluate-Postfix(tokens)
function evaluatePostfix(tokens) {
  //stack ← empty stack
  var stack = [];
  //steps ← empty string
  var steps = "";
  //step ← 1
  var step = 1;

  //for each token in tokens do
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    //if token is a number then
    if (!isNaN(token)) {
      //PUSH(stack, token)
      stack.push(Number(token));
      //steps ← steps + "Step" + step + ": Push number " + token + "\n"
      steps = steps + "Step" + step + ": Push number " + token + "\n";
    }

    //else if token is a letter A–Z then
    else if (/^[A-Z]$/.test(token)) {
      //PUSH(stack, token)
      stack.push(token);
      //steps ← steps + "Step " + step + ": Push variable " + token + "\n"
      steps = steps + "Step " + step + ": Push variable " + token + "\n";
    }

    //else if token = "=" then 
    else if (token === "=") {
      //if LENGTH(stack) < 2 then 
      if (stack.length < 2) {
        //return ("Error: Not enough values", steps)
        return { error: "Error: Not enough values", steps: steps };
      }
      //end if
      //value ← POP(stack)
      var value = stack.pop();
      //var ← POP(stack)
      var variable = stack.pop();
      //if not IS-VARIABLE(var) then 
      if (typeof variable !== "string" || !/^[A-Z]$/.test(variable)) {
        //return ("Error: Invalid variable", steps)
        return { error: "Error: Invalid variable", steps: steps };
      }
      //end if 
      //INSERT(symbolTable, var, value)
      symbolTable.insert(variable, value);
      //steps ← steps + "Step " + step + ": Assign " + value + " to " + var + "\n"
      steps = steps + "Step " + step + ": Assign " + value + " to " + variable + "\n";
    }

    //else if token = "DEL" then
    else if (token === "DEL") {
      //if LENGTH(stack) < 1 then 
      if (stack.length < 1) {
        //return ("Error: Nothing to delete", steps)
        return { error: "Error: Nothing to delete", steps: steps };
      }
      //end if 
      //var ← POP(stack)
      var variable = stack.pop();
      //if not DELETE(symbolTable, var) then 
      if (!symbolTable.delete(variable)) {
        //return ("Error: Cannot delete", steps)
        return { error: "Error: Cannot delete", steps: steps };
      }
      //end if
      //steps ← steps + "Step " + step + ": Delete variable " + var + "\n"
      steps = steps + "Step " + step + ": Delete variable " + variable + "\n";
    }

    //else if token ∈ {"+", "-", "*", "/"} then
    else if (["+", "-", "*", "/"].includes(token)) {
      //if LENGTH(stack) < 2 then 
      if (stack.length < 2) {
        //return ("Error: Not enough operands", steps)
        return { error: "Error: Not enough operands", steps: steps };
      }
      //end if
      //b ← POP(stack)
      var b = stack.pop();
      //a ← POP(stack)
      var a = stack.pop();
      //if IS-VARIABLE(a) then 
      if (typeof a === "string") {
        //a ← SEARCH(symbolTable, a)
        a = symbolTable.search(a);
      }
      //end if
      //if IS-VARIABLE(b) then 
      if (typeof b === "string") {
        //b ← SEARCH(symbolTable, b)
        b = symbolTable.search(b);
      }
      //end if  
      //if a or b is undefined then 
      if (a === undefined || b === undefined) {
        //return ("Error: Variable not found", steps)
        return { error: "Error: Variable not found", steps: steps };
      }
      //end if
      //result ← APPLY-OPERATOR(a, b, token)
      var result = applyOperator(a, b, token);
      //if result = null then 
      if (result === null) {
        //return ("Error: Invalid operation", steps)
        return { error: "Error: Invalid operation", steps: steps };
      }
      //end if
      //PUSH(stack, result)
      stack.push(result);
      //steps←steps+"Step " + step + ": " + a + " " + token + " " + b + " = " + result + "\n"
      steps = steps + "Step " + step + ": " + a + " " + token + " " + b + " = " + result + "\n";
    }

    //else
    else {
      //return ("Error: Unknown token " + token, steps)
      return { error: "Error: Unknown token " + token, steps: steps };
    }
    //end if 
    //step ← step + 1
    step = step + 1;
  }
  //end for
  //if LENGTH(stack) ≠ 1 and ≠ 0 then 
  if (stack.length !== 1 && stack.length !== 0) {
    //return ("Error: Invalid expression", steps)
    return { error: "Error: Invalid expression", steps: steps };
  }
  //end if
  //return (TOP(stack) or "No result", steps)
  return { result: stack[0] || "No result", steps: steps };
}

//ALGORITHM 3: Apply-Operator(a, b, op)
function applyOperator(a, b, op) {
  //Switch statement implementing if-else logic from pseudocode
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return b !== 0 ? a / b : null;
    default: return null;
  }
}

//ALGORITHM 4: Calculate()
function calculate() {
  //input ← read from input field
  var input = document.getElementById("expression").value;
  //tokens ← SPLIT(input)
  var tokens = input.trim().split(/\s+/);

  //(result, steps) ← EVALUATE-POSTFIX(tokens)
  var output = evaluatePostfix(tokens);

  //DISPLAY steps and result in UI
  document.getElementById("steps").innerText = output.steps;
  document.getElementById("output").innerText = output.error || output.result;

  renderSymbolTable(); 
}

//ALGORITHM 5: Render-symbol-table(symbolTable)
function renderSymbolTable() {
  // Get UI element reference
  const display = document.getElementById("symbolTable");
  // Access the symbol table data
  const table = symbolTable.table;
  const keys = Object.keys(table).sort();

  // Handle empty table case
  if (keys.length === 0) {
    display.innerText = "(empty)";
    return;
  }

  //html ← empty string
  let output = "";
  //for each (key, value) in symbolTable do html ← html + format
  for (let key of keys) {
    output += key + " = " + table[key] + "\n"; 
  }

  display.innerText = output;
}

