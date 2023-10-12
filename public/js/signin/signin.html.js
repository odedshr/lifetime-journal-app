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
import { render } from 'nano-jsx';
const Element = (props) => {
    let signInButton;
    const onClick = () => __awaiter(void 0, void 0, void 0, function* () {
        signInButton.setAttribute('disabled', 'true');
        yield props.onSignInButtonClicked();
        signInButton.removeAttribute('disabled');
    });
    return (_jsxs("main", { class: "signin", children: [_jsx("h1", { children: "Lifetime Journal" }), _jsx("form", { children: _jsx("button", { type: "button", class: "button-sign-in", onClick: onClick, id: "btnSignIn", ref: (el) => signInButton = el, children: _jsx("span", { children: "Sign in with Google" }) }) })] }));
};
function appendChild(parent, props) {
    render(_jsx(Element, { onSignInButtonClicked: props.onSignInButtonClicked }), parent);
}
export { appendChild };
