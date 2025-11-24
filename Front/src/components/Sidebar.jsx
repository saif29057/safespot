import { Link } from "react-router-dom";
//import "./Sidebar.css"; // On stylise plus tard

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>SafeSpot</h2>
      <nav>
        <ul>
          <li><Link to="/prediction">Prediction</Link></li>
          <li><Link to="/sinistre">Sinistre</Link></li>
          <li><Link to="/historique">Historique</Link></li>
          <li><Link to="/meteo">Météo</Link></li>
          <li><Link to="/review">Laisser un Review</Link></li>
          <li><Link to="/meteo">Voir Météo</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
