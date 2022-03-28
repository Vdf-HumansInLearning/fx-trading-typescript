import React from 'react'
import { Link } from "react-router-dom";


export default function NotFoundPage() {
    const getCookie = (cname) => {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(";");
        for (let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) === " ") {
            c = c.substring(1);
          }
          if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
      };
    
      return (
        <div id="app">
          <div className="d-flex"></div>
          <main className="body-container-404">
            <div className="main__container404">
              <img
                className="background_img"
                src="https://raw.githubusercontent.com/WebToLearn/fx-trading-app/master/App/ui/src/assets/img/error_404.png"
                alt="logo404"
              />
              <div className="message_container">
                <p className="help-block-404">
                  Sorry, the page your are looking for does not exist
                </p>
              </div>
              <div className="button__container404">
                {getCookie("username") ? (
                  <Link to="/">
                    <button className="btn btn-primary main__button404">
                      Go to transactions
                    </button>
                  </Link>
                ) : (
                  <Link to="/login">
                    <button className="btn btn-primary main__button404">
                      Go to login
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </main>
        </div>
      );
}
