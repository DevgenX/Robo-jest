import { shallow } from "enzyme";
import Scroll from "./Scroll";

it("should render without errors", () => {
  expect(shallow(<Scroll />)).toMatchSnapshot();
});
