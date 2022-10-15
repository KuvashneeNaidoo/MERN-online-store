import React from 'react';
import './loading.css';

// Created a function which will be used to return a loader which will be displayed when the user awaits the content from the website.
function Loading() {
  return (
    <div className="load-page">
      <div className="loader">
        <div>
          <div>
            <div>
              <div>
                <div>
                  <div>
                    <div>
                      <div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Exporting the Loading component to be used in different components of the application. */
export default Loading;
