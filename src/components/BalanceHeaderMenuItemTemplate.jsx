import classNames from "classnames";

const BalanceHeaderMenuItemTemplate = (item, options) => (
	<a
		className={options.className}
		target={item.target}
		onClick={options.onClick}
		role='none'>
		<div className='menuitem-balance'>
			<span
				className={classNames(options.labelClassName, {
					"menuitem-balance-label": true,
				})}>
				<b>{item.balance}</b>
			</span>
			<span className={options.labelClassName}>{item.label}</span>
			<span className={options.submenuIconClassName} />
		</div>
	</a>
);

export default BalanceHeaderMenuItemTemplate;
