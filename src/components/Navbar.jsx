import React, { Component, createRef } from "react";
import { deviceType, isMobile } from "react-device-detect";
import classNames from "classnames";
import isArray from "lodash/isArray";
import isString from "lodash/isString";
import isFunction from "lodash/isFunction";
import debounce from "lodash/debounce";
import { Menubar } from "primereact/menubar";
import { PanelMenu } from "primereact/panelmenu";
import { Dialog } from "primereact/dialog";

import NavBuilder from "../utils/NavBuilder";
import BalanceHeaderMenuItemTemplate from "./BalanceHeaderMenuItemTemplate";
import HeaderMenuItemTemplate from "./HeaderMenuItemTemplate";
import MobileToggleButtonTemplate from "./MobileToggleButtonTemplate";
import SignIn from "./SignIn";
import "./Navbar.scss";

class Navbar extends Component {
	constructor(props) {
		super(props);

		const screenType = this.getScreenType();
		const { userData } = props;

		this.state = {
			menuItems: NavBuilder.buildMenuItems(userData),
			page: "mail",
			screenType,
			showSignIn: false,
		};

		this.resizeHandler = debounce(this.resizeHandler, 500);
	}

	componentDidMount() {
		window.addEventListener("resize", this.resizeHandler);
	}

	componentDidUpdate(prevProp) {
		const { userData } = this.props;

		if (prevProp.userData !== userData) {
			this.setState({
				menuItems: NavBuilder.buildMenuItems(userData),
			});
		}
	}

	/**
	 * 'phone', 'tablet' or 'desktop'.
	 *
	 * @return {string}
	 */
	getScreenType = () => {
		const { clientWidth } = document.body;

		if (isMobile) {
			return deviceType === "mobile" ? "phone" : "tablet";
		} else if (clientWidth > 960) {
			return "desktop";
		} else if (clientWidth <= 960 && clientWidth > 769) {
			return "tablet";
		} else {
			return "phone";
		}
	};

	/**
	 * Return menu items for Menubar.
	 *
	 * @returns {array}
	 */
	buildModel = () => {
		const screenType = this.getScreenType();
		const { menuItems } = this.state;

		const leftMenuItems = [
			menuItems.mail,
			menuItems.orders,
			menuItems.marketing,
			menuItems.products,
			menuItems.contacts,
			menuItems.history,
			menuItems.reports,
			menuItems.inbounds,
		];

		if (screenType === "tablet") {
			return this.buildTabletModel(leftMenuItems, [
				menuItems.supplies,
				menuItems.account,
				menuItems.balance,
				menuItems.help,
			]);
		} else if (screenType === "phone") {
			return this.buildPhoneModel([
				...leftMenuItems,
				menuItems.supplies,
				menuItems.account,
				menuItems.balance,
				menuItems.help,
			]);
		}

		// desktop screen type
		return this.buildDesktopModel(leftMenuItems, [
			menuItems.balance,
			menuItems.account,
		]);
	};

	buildDesktopModel = (left, right) => {
		const { signIn } = this.props;

		const rightMenuItems = right
			.filter((rootItem) => rootItem)
			.map((rootItem) => ({
				...rootItem,
				className: "right-aligned-item",
				template:
					rootItem.id === "balance"
						? BalanceHeaderMenuItemTemplate
						: null,
				items: isArray(rootItem.items)
					? rootItem.items.map((subItem) =>
							subItem.id === "signInform"
								? {
										className: "sigin-in",
										template: () => (
											<SignIn onSignInClick={signIn} />
										),
								  }
								: subItem
					  )
					: null,
			}));

		return [
			...this.bindMenuItems(left),
			{
				separator: true,
			},
			...this.bindMenuItems(rightMenuItems),
		];
	};

	buildTabletModel = (leftMenuItems, rightMenuItems) => {
		// base model
		const model = this.bindMenuItems(leftMenuItems);

		// adding right toggle button
		model.push(
			{
				separator: true,
			},
			{
				label: "",
				icon: "pi pi-bars",
				className: "mobile-toggle-button right-aligned-item tablet",
				items: [
					{
						template: () => (
							<PanelMenu
								className='panel-menu-tablet tablet'
								model={this.bindMenuItems(
									rightMenuItems
										.filter((rootItem) => rootItem)
										.map((rootItem) => {
											if (rootItem.id === "signIn") {
												return {
													...rootItem,
													items: null,
												};
											} else if (
												rootItem.id === "balance"
											) {
												return {
													...rootItem,
													label: isString(
														rootItem.balance
													)
														? `${rootItem.balance} ${rootItem.label}`
														: rootItem.label,
												};
											}

											return rootItem;
										})
								)}
							/>
						),
					},
				],
			}
		);

		return model;
	};

	buildPhoneModel = (rightMenuItems) => [
		{
			separator: true,
		},
		{
			className: "mobile-toggle-button right-aligned-item phone",
			template: MobileToggleButtonTemplate,
			items: [
				{
					template: () => (
						<PanelMenu
							className='panel-menu-phone phone'
							model={this.bindMenuItems(
								rightMenuItems
									.filter((rootItem) => rootItem)
									.map((rootItem) => {
										if (rootItem.id === "signIn") {
											return {
												...rootItem,
												items: null,
											};
										} else if (rootItem.id === "balance") {
											return {
												...rootItem,
												label: isString(
													rootItem.balance
												)
													? `${rootItem.balance} ${rootItem.label}`
													: rootItem.label,
											};
										}

										return rootItem;
									})
							)}
						/>
					),
				},
			],
		},
	];

	bindMenuItems = (menuItems) => {
		const { page } = this.state;

		return menuItems
			.filter((rootItem) => rootItem)
			.reduce(
				(_menuItems, rootItem) => [
					..._menuItems,
					{
						...rootItem,

						// highlight root menu item
						className: classNames(rootItem.className, {
							"p-menuitem-active": rootItem.id === page,
						}),

						// use template
						template: isFunction(rootItem.template)
							? rootItem.template
							: HeaderMenuItemTemplate,

						// bind click event handler
						command: !isArray(rootItem.items)
							? this.itemClickHandler
							: null,

						// bind click event handler on child items
						items: isArray(rootItem.items)
							? rootItem.items.map((subItem) => ({
									...subItem,
									command: this.itemClickHandler,
							  }))
							: null,
					},
				],
				[]
			);
	};

	resizeHandler = () => {
		this.setState({
			screenType: this.getScreenType(),
		});
	};

	itemClickHandler = ({ item }) => {
		const { signIn, signOut } = this.props;
		const { id } = item;

		if (id === "signOut") {
			signOut();
		} else if (id === "signIn") {
			this.setState({
				showSignIn: true,
			});
		}
	};

	signInHandler = (username) => {
		const { signIn } = this.props;

		this.setState(
			{
				showSignIn: false,
			},
			() => signIn(username)
		);
	};

	render() {
		const { signIn } = this.props;
		const { screenType, showSignIn } = this.state;
		const model = this.buildModel();

		return (
			<>
				<Menubar
					className={`navbar ${screenType}`}
					start={<div className='app-logo'></div>}
					model={model}
				/>

				<Dialog
					header='Sign In'
					visible={showSignIn}
					onHide={() => this.setState({ showSignIn: false })}
					modal
					dismissableMask>
					<SignIn
						class=''
						onSignInClick={this.signInHandler}></SignIn>
				</Dialog>
			</>
		);
	}
}

export default Navbar;
