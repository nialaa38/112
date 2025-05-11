import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/notifications">Notifications</Link>
        </li>
        <li>
          <Link to="/tasks/1">Task Details (Example Task)</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;