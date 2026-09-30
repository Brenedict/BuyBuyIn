import { useNavigate, useLocation } from "react-router";

function useNavigatePage() {
    const navigate = useNavigate();
    const location = useLocation();

    return (route?: string, keepQuery = false) => {
        // If called without parameters, safely go up one level (e.g. close the modal)
        if (route === undefined) {
            // ".." goes up one segment. We append location.search to keep queries.
            navigate(`..${location.search}`, { relative: "path" });
            return;
        }

        // Handle standard string-based route navigation
        if (keepQuery && location.search) {
            route = `${route}${location.search}`;
        }

        navigate(route, { state: { backgroundLocation: location } });
    };
}

export default useNavigatePage;
