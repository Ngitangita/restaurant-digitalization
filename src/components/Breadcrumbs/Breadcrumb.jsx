import { Link } from 'react-router-dom';

const Breadcrumb = ({ pageName }) => {
  return (
    <div className="Breadcrumb z-10 lg:z-10 mb-6 bg-white p-3 rounded flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-md2 font-semibold text-gray-500 dark:text-white">
        {pageName}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium text-gray-500" to="/">
              Accueil /
            </Link>
          </li>
          <li className="font-medium text-primary text-gray-500">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
