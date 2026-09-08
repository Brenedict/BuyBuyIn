import type { ColorVariant } from "../types/common";
import Table from "./Table";
import { Text } from "./Text";
import DangerousIcon from "@mui/icons-material/Dangerous";

export function EmptyData({ bgVariant }: { bgVariant: ColorVariant }) {
    return (
        <Table.Row bgVariant={bgVariant}>
            <Table.Data colSpan={9999} className="px-0">
                <div className="flex items-center justify-center py-8">
                    <div className="p-2 bg-crimson rounded-2xl flex justify-center items-center">
                        <Text
                            variant="cream"
                            svg={{ icon: DangerousIcon, size: "medium", gap: "big", position: "left" }}
                        >
                            No data to show here!
                        </Text>
                    </div>
                </div>
            </Table.Data>
        </Table.Row>
    );
}
