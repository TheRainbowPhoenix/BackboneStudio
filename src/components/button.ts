import { i18n } from "../lib/langPack";

export type ButtonOptions = Partial<{
  icon: string,
  text: string,  // TODO: LangPack !
  disabled: boolean,
  asDiv: boolean
}>;

const Button = (className: string, options: ButtonOptions = {}) => {
  const button: HTMLButtonElement = document.createElement(options.asDiv ? 'div' : 'button') as any;
  button.className = className + (options.icon ? ' bsico-' + options.icon : '');

  if(options.disabled) {
    button.setAttribute('disabled', 'true');
  }

  if(options.text) {
    button.append(i18n(options.text));
  }
};

export default Button;