var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "nano-jsx/esm/jsx-runtime";
const Element = (props) => {
    const oldValue = props.field.value;
    let field;
    const onBlur = (evt) => __awaiter(void 0, void 0, void 0, function* () {
        const value = +field.value;
        props.onValueChanged(Object.assign(Object.assign({}, props.field), { value }), value !== oldValue);
    });
    return (_jsxs("div", { class: "number-field", children: [_jsx("label", { for: "entry-number", class: "entry-label", children: props.field.label }), _jsx("input", { type: "number", id: "entry-number", class: "number-field", name: "entry-number", min: props.field.min || '', max: props.field.max || '', step: props.field.step || '', ref: (el) => field = el, onBlur: onBlur, value: props.field.value }), _jsx("div", { class: "entry-unit", children: props.field.unit })] }));
};
export { Element };
