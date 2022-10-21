// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import DesktopManager from './DesktopManager.js';
import {removeTags} from './functions.js';
import { fireEvent, render } from "@testing-library/react";

const makeSut = () => {
    return render(
        <DesktopManager
        />
    )
}

describe("<DesktopManager />", () => {
    test("Should open file manager when 'Open Directory' button pressed", () => {
        const { container, getByRole } = makeSut({});
        fireEvent.click(getByRole('button', {name: "Open Directory"}));
        expect(DesktopManager).toBeDefined();
    })
    test("Should remove the tags of a file", () =>{
        expect(removeTags(["hello.png", "my.space", "face.pdf", ".asdkjfh"])).toEqual(["hello","my","face",".asdkjfh"]);
    })
})
