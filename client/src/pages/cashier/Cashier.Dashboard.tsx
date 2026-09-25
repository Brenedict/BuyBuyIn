import { Card } from "../../components/Card";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import Icon from "../../components/Icon";
import { Block, Campaign, LocalOffer, Paid, PriorityHigh, ShoppingCartCheckout, Whatshot } from "@mui/icons-material";

export function Cashier_Dashboard() {
    const cashierName = "Kenneth";
    const syncTime = "67";
    const totalSales = "8500";
    const todayTransactions = "18";
    const productSold = "49";
    const refundsVoid = "3";
    const bestSellingProducts = [
        ["Item 1 - Classic Cotton Crewneck (Black - M)", "SKU-APP-003"],
        ["Item 2 - Premium Pique Polo Shirt (Navy - L)", "SKU-APP-012"],
    ];
    const lowStockProducts = [
        ["SKU-012", "18"],
        ["SKU-099", "5"],
    ];

    return (
        <Card className="p-6">
            <Card.Header className="flex flex-col gap-6">
                <div className="flex flex-row justify-between">
                    <Text weight="bold" size="bigger">
                        Hey, {cashierName}!
                    </Text>
                    <Text weight="regular" size="small" variant="off-white">
                        Last Sync: {syncTime} min ago
                    </Text>
                </div>
            </Card.Header>

            <Card.Body>
                <div className="flex flex-row gap-10 justify-center">
                    <Card className="p-[8px] bg-off-white" isGlass={false} dropShadow={false}>
                        <Card.Body className="flex flex-col gap-4">
                            <Text weight="regular" size="medium" variant="crimson">
                                Today's Total Sales
                            </Text>

                            <div className="flex flex-row justify-center gap-4">
                                <Icon icon={LocalOffer} size="bigger" variant="crimson"></Icon>
                                <Text weight="extraBold" size="bigger">
                                    ₱ {totalSales}
                                </Text>
                            </div>
                        </Card.Body>
                    </Card>

                    <Card className="p-[8px] bg-off-white" isGlass={false} dropShadow={false}>
                        <Card.Body className="flex flex-col gap-4">
                            <Text weight="regular" size="medium" variant="crimson">
                                Today's Transactions
                            </Text>

                            <div className="flex flex-row justify-center gap-4">
                                <Icon icon={Paid} size="bigger" variant="crimson"></Icon>
                                <Text weight="extraBold" size="bigger">
                                    {todayTransactions}
                                </Text>
                            </div>
                        </Card.Body>
                    </Card>

                    <Card className="p-[8px] bg-off-white" isGlass={false} dropShadow={false}>
                        <Card.Body className="flex flex-col gap-4">
                            <Text weight="regular" size="medium" variant="crimson">
                                Today's Total Sales
                            </Text>

                            <div className="flex flex-row justify-center gap-4">
                                <Icon icon={ShoppingCartCheckout} size="bigger" variant="crimson"></Icon>
                                <Text weight="extraBold" size="bigger">
                                    {productSold}
                                </Text>
                            </div>
                        </Card.Body>
                    </Card>

                    <Card className="p-[8px] bg-off-white" isGlass={false} dropShadow={false}>
                        <Card.Body className="flex flex-col gap-4">
                            <Text weight="regular" size="medium" variant="crimson">
                                Today's Total Sales
                            </Text>

                            <div className="flex flex-row justify-center gap-4">
                                <Icon icon={Block} size="bigger" variant="crimson"></Icon>
                                <Text weight="extraBold" size="bigger">
                                    {refundsVoid}
                                </Text>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </Card.Body>

            <Card.Body>
                <div>
                    <div className="flex flex-row items-center gap-6">
                        <div className="flex flex-row">
                            <Icon icon={Campaign} size="iconHero" variant="crimson"></Icon>
                            <Text size="mediumBig" weight="extraBold">
                                Announcement:
                            </Text>
                        </div>

                        <div className="flex-1 h-[1px] bg-crimson"></div>
                    </div>
                    <Text weight="regular" size="description" variant="black" className="px-10">
                        The 12% off Independence Day Sale starts this Friday! Please ensure your local terminal caches
                        are fully synced before opening shifts. Reach out to your Branch Manager if promo tags do not
                        render on screen.
                    </Text>
                </div>
            </Card.Body>

            <Card.Body className="flex flex-row gap-5">
                <Card className="w-7/10 p-2 bg-off-white">
                    <Card.Body className="flex flex-row justify-center">
                        <div className="flex flex-row items-center w-3/10">
                            <Icon icon={Whatshot} size="iconHero" variant="crimson" className="justify-center"></Icon>
                            <Text weight="bold" size="medium" variant="crimson" className="justify-center">
                                Best Selling Products:
                            </Text>
                        </div>

                        <div className="w-7/10">
                            {bestSellingProducts.map((product) => (
                                <div className="pl-10">
                                    <Text weight="regular" size="medium" variant="crimson">
                                        {product[0]}
                                    </Text>
                                    <Text weight="regular" size="medium" variant="black">
                                        {product[1]}
                                    </Text>
                                </div>
                            ))}
                        </div>
                    </Card.Body>
                </Card>

                <Card className="w-3/10 p-2 bg-off-white">
                    <Card.Body>
                        <div className="flex flex-row">
                            <Text weight="bold" size="medium" variant="crimson">
                                Low-Stock Products:
                            </Text>
                            <Icon icon={PriorityHigh} size="iconHero" variant="crimson"></Icon>
                        </div>

                        {lowStockProducts.map((product) => (
                            <div>
                                <Text weight="regular" size="medium" variant="crimson">
                                    {product[0]} [{product[1]} left]
                                </Text>
                            </div>
                        ))}
                    </Card.Body>
                </Card>
            </Card.Body>
        </Card>
    );
}

export default Cashier_Dashboard;
