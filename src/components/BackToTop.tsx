import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";

export default function BackToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return (
    <ScrollToTop
      smooth
      top={200}
      className="to-top"
      component={<i className="fa fa-chevron-up fa-lg" />}
    />
  );
}
