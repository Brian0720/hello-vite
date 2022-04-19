import isArray from "lodash/isArray";
import isString from "lodash/isString";

const HeaderMenuItemTemplate = (item, options) => {
	return (
		<a
			className={options.className}
			target={item.target}
			onClick={options.onClick}
			role='none'>
			{isString(item.icon) && <span className={options.iconClassName} />}
			<span className={options.labelClassName}>{item.label}</span>
			{isArray(item.items) && (
				<span className={options.submenuIconClassName} />
			)}
		</a>
	);
};

export default HeaderMenuItemTemplate;
