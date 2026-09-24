import { useNavigate, useLocation } from "react-router";

function useNavigatePage() {
    const navigate = useNavigate();
    const location = useLocation();

    return (route: string, keepQuery = false) => {
        if (keepQuery && location.search) {
            route = `${route}${location.search}`;
        }
        navigate(route, { state: { backgroundLocation: location } });
    };
}

export default useNavigatePage;
