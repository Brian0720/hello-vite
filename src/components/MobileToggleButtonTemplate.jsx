import classNames from "classnames";

const MobileToggleButtonTemplate = (item, options) => (
	<a
		className={options.className}
		target={item.target}
		onClick={options.onClick}
		role='none'>
		<span className={classNames(options.iconClassName, "pi pi-bars")} />
		<span className={classNames(options.iconClassName, "pi pi-times")} />
	</a>
);

export default MobileToggleButtonTemplate;
