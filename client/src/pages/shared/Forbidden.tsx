// General Imports
import { Outlet, useSearchParams } from "react-router";

// Components
import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import { PageHeader } from "../../components/PageHeader";

// Material UI Icons
import HomeIcon from "@mui/icons-material/Home";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Routes
import { ROLE_HOME } from "../../routes/Routes";

// Context
import { useGlobalContext } from "./AccessValidator";

// Hooks
import useNavigatePage from "../../hooks/useNavigatePage";

// TODO: Create a customized 403 page that is more visually appealing and informative than the default one.
export function Forbidden() {
    const [searchParams] = useSearchParams();
    const { user } = useGlobalContext();
    const navigatePage = useNavigatePage();

    // Set by RoleBoundary so we can name the page that was blocked.
    const blockedPath = searchParams.get("from");

    const home = user?.role ? ROLE_HOME[user.role] : null;

    return (
        <Card>
            <Card.Body className="flex flex-col gap-6 items-center text-center py-12">
                <PageHeader
                    headerText="Access denied"
                    descriptionText="Your role does not have permission to view that page."
                />

                {blockedPath && (
                    <Text size="small" variant="brown" weight="light" className="break-all">
                        Blocked path: {blockedPath}
                    </Text>
                )}

                <div className="flex gap-4">
                    {home && (
                        <Button variant="main" leftIcon={HomeIcon} onClick={() => navigatePage(home)}>
                            Go to my dashboard
                        </Button>
                    )}
                    <Button variant="secondary" leftIcon={ArrowBackIcon} onClick={() => navigatePage()}>
                        Go back
                    </Button>
                </div>
            </Card.Body>

            {
                // Displays all global and page popups
                <Outlet />
            }
        </Card>
    );
}

export default Forbidden;
