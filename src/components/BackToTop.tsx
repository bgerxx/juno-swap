import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";

export default function BackToTop() {
  const { pathname } = useLocation();
  let position = window.scrollY;

  useEffect(() => {
    if (pathname || position > 0) {
      window.scrollTo(0, 0);
    }
  }, [pathname, position]);

  return (
    <ScrollToTop
      smooth
      top={200}
      className="to-top"
      component={<i className="fa fa-chevron-up fa-lg" />}
    />
  );
}
