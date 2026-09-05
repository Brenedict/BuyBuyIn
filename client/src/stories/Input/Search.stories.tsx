import type { Meta, StoryObj } from "@storybook/react-vite";
import { SearchInput } from "../../components/Input";
import "../../index.css";
import { fn } from "storybook/test";

// Meta for SearchInput
const searchMeta = {
    title: "Input/Search",
    component: SearchInput,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    args: {
        id: "search",
        name: "search",
        placeholder: "Search anything here",
        onChange: fn(),
        isRequired: true,
        disabled: false,
        hidden: false,
    },
} satisfies Meta<typeof SearchInput>;

export default searchMeta;
type Story = StoryObj<typeof searchMeta>;

export const SearchInputStory: Story = {
    args: {
        id: "search",
        name: "search",
        placeholder: "Search anything here",
    },
};

export const test: Story = {
    args: {
        id: "search",
        name: "search",
        placeholder: "Search anything here",
    },
    render: (args) => (
        <div className="flex flex-col gap-10">
            <SearchInput {...args} />
            <SearchInput {...args} />
            <SearchInput {...args} />
        </div>
    ),
};
