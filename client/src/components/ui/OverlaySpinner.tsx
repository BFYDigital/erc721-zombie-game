import { Spinner } from "react-bootstrap";

interface IOverlaySpinnerProps {
  show: boolean;
}

const OverlaySpinner = ({ show }: IOverlaySpinnerProps) => {
  return (
    <>
      {show &&
        <div className="loading-overlay">
          <div className="overlay-inner">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">loading...</span>
            </Spinner>
          </div>
        </div>
      }
    </>
  );
};

export default OverlaySpinner;
