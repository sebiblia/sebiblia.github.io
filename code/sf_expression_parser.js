
/*
THIS CODE IS BASED ON PACKAGE ExpressionParser
IT HAS SOME ADAPTATIONS
*/

import { is_verse_id, parse_citation, } from './sf_biblang_mgr.js';

const DEBUG_EV_RPN = false;
const DEBUG_EV_TNK = false;
const DEBUG_TOKENIZE = false;
//const DEBUG_CALC_RPN = false;

"use strict";
//Object.defineProperty(exports, "__esModule", { value: true });
//exports.isArgumentsArray = void 0;
const isInArray = (array, value) => {
    let i, len;
    for (i = 0, len = array.length; i !== len; ++i) {
        if (array[i] === value) {
            return true;
        }
    }
    return false;
};
const mapValues = (mapper) => (obj) => {
    const result = {};
    Object.keys(obj).forEach((key) => {
        result[key] = mapper(obj[key]);
    });
    return result;
};
const applyToValues = (delegate) => (obj) => {
    Object.keys(obj).forEach((key) => {
        obj[key] = delegate(obj[key]);
    });
};
const convertKeys = (converter) => (obj) => {
    const newKeys = Object.keys(obj)
        .map((key) => (obj.hasOwnProperty(key) ? [key, converter(key)] : null))
        .filter((val) => val != null);
    newKeys.forEach(([oldKey, newKey]) => {
        if (oldKey !== newKey) {
            obj[newKey] = obj[oldKey];
            delete obj[oldKey];
        }
    });
    return obj;
};
//exports.isArgumentsArray = (args) => Array.isArray(args) && args.isArgumentsArray;
export let isArgumentsArray = (args) => Array.isArray(args) && args.isArgumentsArray;
function isBasicDataObject(obj) {
    if (obj === null || typeof obj !== "object")
        return false;
    const proto = Object.getPrototypeOf(obj);
    // If the prototype is not Object.prototype, it's not a plain object
    if (proto !== Object.prototype)
        return false;
    // Optional: check the prototype doesn't have custom methods
    const methodNames = Object.getOwnPropertyNames(proto).filter((key) => typeof proto[key] === "function" && key !== "constructor");
    return methodNames.length === 0;
}
//const asyThunkEvaluator = async (val) => await evaluate(val);
const thunkEvaluator = (val) => evaluate(val);
const objEvaluator = mapValues(thunkEvaluator);
const classObjEvaluator = (val) => {
    applyToValues(thunkEvaluator)(val);
    return val;
};
const evaluate = (thunkExpression) => {
    if (typeof thunkExpression === "function" && thunkExpression.length === 0) {
		if(DEBUG_EV_TNK){ console.log(`evTnk. function.`); }
        return evaluate(thunkExpression());
    }
    //else if (exports.isArgumentsArray(thunkExpression)) {
    else if (isArgumentsArray(thunkExpression)) {
		if(DEBUG_EV_TNK){ console.log(`evTnk. isArgumentsArray.`); }
        return thunkExpression.map((val) => evaluate(val()));
    }
    else if (Array.isArray(thunkExpression)) {
		if(DEBUG_EV_TNK){ console.log(`evTnk. Array.isArray.`); }
        return thunkExpression.map(thunkEvaluator);
    }
    else if (isBasicDataObject(thunkExpression)) {
		if(DEBUG_EV_TNK){ console.log(`evTnk. isBasicDataObject.`); }
        return objEvaluator(thunkExpression);
    }
    else if (typeof thunkExpression === "object") {
		if(DEBUG_EV_TNK){ console.log(`evTnk. object.`); }
        return classObjEvaluator(thunkExpression);
    }
    else {
		if(DEBUG_EV_TNK){ console.log(`evTnk. other.`); }
        return thunkExpression;
    }
};
// JLQ ADAPTATION pass prev to delegate
const thunk = (delegate, ...args) => (...prev) => delegate(...args, ...prev);
const isOptionsLegacy = (options) => {
    return options.hasOwnProperty("SEPARATOR");
};
const isOptionsAmmended = (options) => {
    return options.hasOwnProperty("SEPARATORS");
};
export class ExpressionParser {
    constructor(options) {
        this.options = options;
        this.surroundingOpen = {};
        this.surroundingClose = {};
        if (this.options.SURROUNDING) {
            Object.keys(this.options.SURROUNDING).forEach((key) => {
                const item = this.options.SURROUNDING[key];
                let open = item.OPEN;
                let close = item.CLOSE;
                if (this.options.isCaseInsensitive) {
                    key = key.toUpperCase();
                    open = open.toUpperCase();
                    close = close.toUpperCase();
                }
                this.surroundingOpen[open] = true;
                this.surroundingClose[close] = {
                    OPEN: open,
                    ALIAS: key,
                };
            });
        }
        if (this.options.isCaseInsensitive) {
            // convert all terms to uppercase
            const upperCaser = (key) => key.toUpperCase();
            const upperCaseKeys = convertKeys(upperCaser);
            const upperCaseVals = mapValues(upperCaser);
            if (!(this.options.PREFIX_OPS instanceof Function)) {
                upperCaseKeys(this.options.PREFIX_OPS);
            }
            if (!(this.options.INFIX_OPS instanceof Function)) {
                upperCaseKeys(this.options.INFIX_OPS);
            }
            upperCaseKeys(this.options.AMBIGUOUS);
            upperCaseVals(this.options.AMBIGUOUS);
            this.options.PRECEDENCE = this.options.PRECEDENCE.map((arr) => arr.map((val) => val.toUpperCase()));
        }
        if (this.options.LITERAL_OPEN) {
            this.LIT_CLOSE_REGEX = new RegExp(`${this.options.LITERAL_OPEN}\$`);
        }
        if (this.options.LITERAL_CLOSE) {
            this.LIT_OPEN_REGEX = new RegExp(`^${this.options.LITERAL_CLOSE}`);
        }
        this.symbols = {};
        this.options.SYMBOLS.forEach((symbol) => {
            this.symbols[symbol] = symbol;
        });
    }
    resolveCase(key) {
        return this.options.isCaseInsensitive ? key.toUpperCase() : key;
    }
    resolveAmbiguity(token) {
        return this.options.AMBIGUOUS[this.resolveCase(token)];
    }
    isSymbol(char) {
        return this.symbols[char] === char;
    }
    getPrefixOp(op) {
        if (this.options.termTyper && this.options.termTyper(op) === "function") {
            const termValue = this.options.termDelegate(op);
            if (typeof termValue !== "function") {
                throw new Error(`${op} is not a function.`);
            }
            const result = termValue;
            return (argsThunk) => {
                const args = evaluate(argsThunk);
                if (!Array.isArray(args)) {
                    return () => result(args);
                }
                else {
                    return () => result(...args);
                }
            };
        }
        if (this.options.PREFIX_OPS instanceof Function) {
            return this.options.PREFIX_OPS(op);
        }
        else {
            return this.options.PREFIX_OPS[this.resolveCase(op)];
        }
    }
    getInfixOp(op) {
        if (this.options.INFIX_OPS instanceof Function) {
            return this.options.INFIX_OPS(op);
        }
        else {
            return this.options.INFIX_OPS[this.resolveCase(op)];
        }
    }
    getPrecedence(op) {
        let i, len, casedOp;
        if (this.options.termTyper && this.options.termTyper(op) === "function") {
            return 0;
        }
        casedOp = this.resolveCase(op);
        for (i = 0, len = this.options.PRECEDENCE.length; i !== len; ++i) {
            if (isInArray(this.options.PRECEDENCE[i], casedOp)) {
                return i;
            }
        }
        return i;
    }
    isSeparator(char) {
        const options = this.options;
        let isSep = false;
        if (this.isWhitespace(char)) {
            isSep = true;
        }
        else if (isOptionsAmmended(options)) {
            isSep = options.SEPARATORS.includes(char);
        }
        return isSep;
    }
    isWhitespace(char) {
        const options = this.options;
        let isSpace = false;
        if (isOptionsAmmended(options)) {
            isSpace = options.WHITESPACE_CHARS.includes(char);
        }
        else {
            isSpace = char === options.SEPARATOR;
        }
        return isSpace;
    }
    defaultWhitespaceSeparator() {
        if (isOptionsLegacy(this.options)) {
            return this.options.SEPARATOR;
        }
        else {
            return this.options.WHITESPACE_CHARS[0];
        }
    }
    // JLQ. ADAPTATION SPECIAL CASE FOR COMMON ERROR
    push_tok(tokens, tok){
		if((tokens.length > 0) && is_verse_id(tok)){
			if(DEBUG_TOKENIZE){ console.log(`push_tok. SPECIAL CASE tok=${tok}`); }
			const lst = tokens[tokens.length - 1];
			const tok2 = lst + '.' + tok;
			if(DEBUG_TOKENIZE){ console.log(`push_tok. SPECIAL CASE tok2=${tok2}`); }
			const cit = parse_citation(tok2);
			if(cit){
				tokens.pop();
				tokens.push(tok2);
				return;
			}
		}
		tokens.push(tok);		
	}
    tokenize(expression) {
        let token = "";
        const EOF = 0;
        const tokens = [];
        const state = {
            startedWithSep: true,
            scanningLiteral: false,
            scanningSymbols: false,
            escaping: false,
        };
        const endWord = (endedWithSep) => {
            if (token !== "") {
                const disambiguated = this.resolveAmbiguity(token);
                if (disambiguated && state.startedWithSep && !endedWithSep) {
                    // ambiguous operator is nestled with the RHS
                    // treat it as a prefix operator
					this.push_tok(tokens, disambiguated);
                    //tokens.push(disambiguated);
                }
                else {
                    // TODO: break apart joined surroundingOpen/Close
					this.push_tok(tokens, token);
                    //tokens.push(token);
                }
                token = "";
                state.startedWithSep = false;
            }
        };
        const chars = expression.split("");
        let currChar;
        let i, len;
        for (i = 0, len = chars.length; i <= len; ++i) {
            if (i === len) {
                currChar = EOF;
            }
            else {
                currChar = chars[i];
            }
            if (currChar === this.options.ESCAPE_CHAR && !state.escaping) {
                state.escaping = true;
                continue;
            }
            else if (state.escaping) {
                token += currChar;
            }
            else if (currChar === this.options.LITERAL_OPEN &&
                !state.scanningLiteral) {
                state.scanningLiteral = true;
                endWord(false);
            }
            else if (currChar === this.options.LITERAL_CLOSE) {
                state.scanningLiteral = false;
				this.push_tok(tokens, this.options.LITERAL_OPEN + token + this.options.LITERAL_CLOSE);
                //tokens.push(this.options.LITERAL_OPEN + token + this.options.LITERAL_CLOSE);
                token = "";
            }
            else if (currChar === EOF) {
                endWord(true);
            }
            else if (state.scanningLiteral) {
                token += currChar;
            }
            else if (this.isSeparator(currChar)) {
                endWord(true);
                state.startedWithSep = true;
                if (!this.isWhitespace(currChar)) {
					this.push_tok(tokens, currChar);
                    //tokens.push(currChar);
                }
            }
            else if (currChar === this.options.GROUP_OPEN ||
                currChar === this.options.GROUP_CLOSE) {
                endWord(currChar === this.options.GROUP_CLOSE);
                state.startedWithSep = currChar === this.options.GROUP_OPEN;
				this.push_tok(tokens, currChar);
                //tokens.push(currChar);
            }
            else if (currChar in this.surroundingOpen ||
                currChar in this.surroundingClose) {
                endWord(currChar in this.surroundingClose);
                state.startedWithSep = currChar in this.surroundingOpen;
				this.push_tok(tokens, currChar);
                //tokens.push(currChar);
            }
            else if ((this.isSymbol(currChar) && !state.scanningSymbols) ||
                (!this.isSymbol(currChar) && state.scanningSymbols)) {
                endWord(false);
                token += currChar;
                state.scanningSymbols = !state.scanningSymbols;
            }
            else {
                token += currChar;
            }
            state.escaping = false;
        }
        return tokens;
    }
    tokensToRpn(tokens) {
        let token;
        let i, len;
        let isInfix, isPrefix, surroundingToken, lastInStack, tokenPrecedence;
        const output = [];
        const stack = [];
        const grouping = [];
        for (i = 0, len = tokens.length; i !== len; ++i) {
            token = tokens[i];
            isInfix = typeof this.getInfixOp(token) !== "undefined";
            isPrefix = typeof this.getPrefixOp(token) !== "undefined";
            if (isInfix || isPrefix) {
                tokenPrecedence = this.getPrecedence(token);
                lastInStack = stack[stack.length - 1];
                while (lastInStack &&
                    ((!!this.getPrefixOp(lastInStack) &&
                        this.getPrecedence(lastInStack) < tokenPrecedence) ||
                        (!!this.getInfixOp(lastInStack) &&
                            this.getPrecedence(lastInStack) <= tokenPrecedence))) {
                    output.push(stack.pop());
                    lastInStack = stack[stack.length - 1];
                }
                stack.push(token);
            }
            else if (this.surroundingOpen[token]) {
                stack.push(token);
                grouping.push(token);
            }
            else if (this.surroundingClose[token]) {
                surroundingToken = this.surroundingClose[token];
                if (grouping.pop() !== surroundingToken.OPEN) {
                    throw new Error(`Mismatched Grouping (unexpected closing "${token}")`);
                }
                token = stack.pop();
                while (token !== surroundingToken.OPEN &&
                    typeof token !== "undefined") {
                    output.push(token);
                    token = stack.pop();
                }
                if (typeof token === "undefined") {
                    throw new Error("Mismatched Grouping");
                }
                stack.push(surroundingToken.ALIAS);
            }
            else if (token === this.options.GROUP_OPEN) {
                stack.push(token);
                grouping.push(token);
            }
            else if (token === this.options.GROUP_CLOSE) {
                if (grouping.pop() !== this.options.GROUP_OPEN) {
                    throw new Error(`Mismatched Grouping (unexpected closing "${token}")`);
                }
                token = stack.pop();
                while (token !== this.options.GROUP_OPEN &&
                    typeof token !== "undefined") {
                    output.push(token);
                    token = stack.pop();
                }
                if (typeof token === "undefined") {
                    throw new Error("Mismatched Grouping");
                }
            }
            else {
                output.push(token);
            }
        }
        for (i = 0, len = stack.length; i !== len; ++i) {
            token = stack.pop();
            surroundingToken = this.surroundingClose[token];
            if (surroundingToken && grouping.pop() !== surroundingToken.OPEN) {
                throw new Error(`Mismatched Grouping (unexpected closing "${token}")`);
            }
            else if (token === this.options.GROUP_CLOSE &&
                grouping.pop() !== this.options.GROUP_OPEN) {
                throw new Error(`Mismatched Grouping (unexpected closing "${token}")`);
            }
            output.push(token);
        }
        if (grouping.length !== 0) {
            throw new Error(`Mismatched Grouping (unexpected "${grouping.pop()}")`);
        }
        return output;
    }
    // JLQ ADAPTATION to handle weird cases
    evaluateRpn(stack, infixer, prefixer, terminator, terms) {
		const arr_ev = [];
		let lhs = null;
		let rhs = null;
        let cons_tok = this.options.CONSEC_OP;
		if((cons_tok == null) && (this.options.INFIX_OPS != null)){
			const kks = Object.keys(this.options.INFIX_OPS);
			if(kks.length > 0){
				cons_tok = kks[0];
			}
		}
		if((cons_tok == null) && (this.options.SEPARATORS != null)){
			if(this.options.SEPARATORS.length > 0){
				cons_tok = this.options.SEPARATORS[0];
			}
		}
		if(DEBUG_EV_RPN){ console.log(`evRpn. Using consec operator= ${cons_tok}`); }
		while(stack.length > 0){
			arr_ev.unshift(this.base_eval_rpn(stack, infixer, prefixer, terminator, terms));
		}
		let ii = 0;
		for(ii = 0; ii < arr_ev.length; ii++){
			if(lhs == null){
				lhs = arr_ev[ii];
			} else {
				rhs = arr_ev[ii];
				lhs = infixer(cons_tok, lhs, rhs);
			}
		}
		return lhs;
	}
    /*
	evaluateRpn(stack, infixer, prefixer, terminator, terms) {
		return this.base_eval_rpn(stack, infixer, prefixer, terminator, terms);
	}*/
    base_eval_rpn(stack, infixer, prefixer, terminator, terms) {
        let lhs, rhs;
		if(DEBUG_EV_RPN){ console.log(`evRpn. STACK=`); console.log(stack); }
        const token = stack.pop();
        if (typeof token === "undefined") {
            throw new Error("Parse Error: unexpected EOF");
        }
        
		if(DEBUG_EV_RPN){ console.log(`evRpn. TOKEN=${token}`); }

        const infixDelegate = this.getInfixOp(token);
        const prefixDelegate = this.getPrefixOp(token);
        const isInfix = infixDelegate && stack.length > 1;
        const isPrefix = prefixDelegate && stack.length > 0;
        if (isInfix || isPrefix) {
			if(DEBUG_EV_RPN){ console.log(`evRpn. isInfix || isPrefix. TOKEN=${token}`); }
            //rhs = this.evaluateRpn(stack, infixer, prefixer, terminator, terms);
            rhs = this.base_eval_rpn(stack, infixer, prefixer, terminator, terms);
        }
        if (isInfix) {
			if(DEBUG_EV_RPN){ console.log(`evRpn. isInfix. TOKEN=${token}`); }
            //lhs = this.evaluateRpn(stack, infixer, prefixer, terminator, terms);
            lhs = this.base_eval_rpn(stack, infixer, prefixer, terminator, terms);
            return infixer(token, lhs, rhs);
        }
        else if (isPrefix) {
			if(DEBUG_EV_RPN){ console.log(`evRpn. isPrefix. TOKEN=${token}`); }
            return prefixer(token, rhs);
        }
        else {
			if(DEBUG_EV_RPN){ console.log(`evRpn. terminator. TOKEN=${token}`); }
            return terminator(token, terms);
        }
		if(DEBUG_EV_RPN){ console.log(`evRpn. GOT TO END !!!!!`); }
    }
    rpnToExpression(stack) {
        const infixExpr = (term, lhs, rhs) => this.options.GROUP_OPEN +
            lhs +
            this.defaultWhitespaceSeparator() +
            term +
            this.defaultWhitespaceSeparator() +
            rhs +
            this.options.GROUP_CLOSE;
        const prefixExpr = (term, rhs) => (this.isSymbol(term) ? term : term + this.defaultWhitespaceSeparator()) +
            this.options.GROUP_OPEN +
            rhs +
            this.options.GROUP_CLOSE;
        const termExpr = (term) => term;
        return this.evaluateRpn(stack, infixExpr, prefixExpr, termExpr);
    }
    rpnToTokens(stack) {
        const infixExpr = (term, lhs, rhs) => [this.options.GROUP_OPEN]
            .concat(lhs)
            .concat([term])
            .concat(rhs)
            .concat([this.options.GROUP_CLOSE]);
        const prefixExpr = (term, rhs) => [term, this.options.GROUP_OPEN]
            .concat(rhs)
            .concat([this.options.GROUP_CLOSE]);
        const termExpr = (term) => [term];
        return this.evaluateRpn(stack, infixExpr, prefixExpr, termExpr);
    }
    rpnToThunk(stack, terms) {
        const infixExpr = (term, lhs, rhs) => thunk(this.getInfixOp(term), lhs, rhs);
        const prefixExpr = (term, rhs) => thunk(this.getPrefixOp(term), rhs);
        const termExpr = (term, terms) => {
            if (this.options.LITERAL_OPEN &&
                term.startsWith(this.options.LITERAL_OPEN)) {
                // Literal string
                return thunk(this.options.termDelegate, term);
				/*
                return () => term
                    .replace(this.LIT_OPEN_REGEX, "")
                    .replace(this.LIT_CLOSE_REGEX, "");
                    */
            }
            else {
                return terms && term in terms
                    ? () => terms[term]
                    : thunk(this.options.termDelegate, term);
            }
        };
        return this.evaluateRpn(stack, infixExpr, prefixExpr, termExpr, terms);
    }
    rpnToValue(stack, terms) {
        return evaluate(this.rpnToThunk(stack, terms));
    }
    thunkToValue(thunk) {
        return evaluate(thunk);
    }
    expressionToRpn(expression) {
        return this.tokensToRpn(this.tokenize(expression));
    }
    expressionToThunk(expression, terms) {
        return this.rpnToThunk(this.expressionToRpn(expression), terms);
    }
    expressionToValue(expression, terms) {
        return this.rpnToValue(this.expressionToRpn(expression), terms);
    }
    tokensToValue(tokens) {
        return this.rpnToValue(this.tokensToRpn(tokens));
    }
    tokensToThunk(tokens) {
        return this.rpnToThunk(this.tokensToRpn(tokens));
    }
}
//exports.default = ExpressionParser;
//# sourceMappingURL=ExpressionParser.js.map