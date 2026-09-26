
import { Outlet } from "react-router-dom";
import AdminSideBar from "../commonPage/adminSidebar";
import AdminHeader from "../commonPage/adminHeader";
import AdminFooter from "../commonPage/adminFooter";
import { useEffect } from "react";
import WebFont from 'webfontloader'; // Import the webfontloader

const AdminLayout = () => {
  useEffect(() => {
    // Dynamically load CSS
    const kaiadminCSS = document.createElement("link");
    kaiadminCSS.rel = "stylesheet";
    kaiadminCSS.href = "/assets/css/kaiadmin.min.css";
    document.head.appendChild(kaiadminCSS);

    const bootstrapCSS = document.createElement("link");
    bootstrapCSS.rel = "stylesheet";
    bootstrapCSS.href = "/assets/css/bootstrap.min.css";
    document.head.appendChild(bootstrapCSS);

    const pluginsCSS = document.createElement("link");
    pluginsCSS.rel = "stylesheet";
    pluginsCSS.href = "/assets/css/plugins.min.css";
    document.head.appendChild(pluginsCSS);


    // Dynamically load WebFont script
    const webFontScript = document.createElement("script");
    webFontScript.src = "/assets/js/plugin/webfont/webfont.min.js";
    webFontScript.async = true;

    webFontScript.onload = () => {
      // Load fonts after the WebFont script is ready
      WebFont.load({
        google: { families: ["Public Sans:300,400,500,600,700"] },
        custom: {
          families: [
            "Font Awesome 5 Solid",
            "Font Awesome 5 Regular",
            "Font Awesome 5 Brands",
            "simple-line-icons",
          ],
          urls: ["/assets/css/fonts.min.css"], // make sure the path is correct
        },
        active: function () {
          sessionStorage.fonts = true;
        },
      });
    };

    document.body.appendChild(webFontScript);

    // Dynamically load JS for jsvectormap
    const jsvectormapJS = document.createElement("script");
    jsvectormapJS.src = "/assets/js/plugin/jsvectormap/jsvectormap.min.js";
    jsvectormapJS.async = true;
    document.body.appendChild(jsvectormapJS);

    const datatablesJS = document.createElement("script");
    datatablesJS.src = "/assets/js/plugin/datatables/datatables.min.js";
    datatablesJS.async = true;
    document.body.appendChild(datatablesJS);

    const jequeryJS = document.createElement("script");
    jequeryJS.src = "/assets/js/core/jquery-3.7.1.min.js";
    jequeryJS.async = true;
    document.body.appendChild(jequeryJS);

    const properJS = document.createElement("script");
    properJS.src = "/assets/js/core/popper.min.js";
    properJS.async = true;
    document.body.appendChild(properJS);

    const scrollerJS = document.createElement("script");
    scrollerJS.src = "/assets/js/plugin/jquery-scrollbar/jquery.scrollbar.min.js";
    scrollerJS.async = true;
    document.body.appendChild(scrollerJS);

    const kaiadminJS = document.createElement("script");
    kaiadminJS.src = "/assets/js/kaiadmin.min.js";
    kaiadminJS.async = true;
    document.body.appendChild(kaiadminJS);

    // Clean up: Remove the dynamically loaded CSS, JS, and WebFont script
    return () => {
      document.head.removeChild(kaiadminCSS);
      document.head.removeChild(bootstrapCSS);
      document.head.removeChild(pluginsCSS);
      document.body.removeChild(jsvectormapJS);
      document.body.removeChild(webFontScript);
      document.body.removeChild(datatablesJS);
      document.body.removeChild(jequeryJS);
      document.body.removeChild(properJS);
      document.body.removeChild(scrollerJS);
      document.body.removeChild(kaiadminJS);
    };

  }, []); // Empty dependency array ensures this only runs on mount/unmount

  return (
    <>
      <div className="wrapper">
        <AdminSideBar />
        <div className="main-panel">
          <AdminHeader />
          <div className="container ">
            <div className="page-inner">
              <main>
                <Outlet />
              </main>
            </div>
          </div>
          <AdminFooter />
            </div>
      </div>
    </>
  );
};

export default AdminLayout;

