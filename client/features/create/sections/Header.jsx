import { Link } from "next-view-transitions";

export default function Header() {
    return (
        <header className="creation-header">
            <Link className="creation-brand" href="/">
                <span className="creation-brand__mark" aria-hidden="true">✦</span>
                <span>AI Adventure World</span>
            </Link>
            <Link className="creation-back" href="/">
                <span aria-hidden="true">←</span> Back to home
            </Link>
        </header>
    );
}