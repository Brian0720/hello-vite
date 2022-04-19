import isArray from "lodash/isArray";
import isNumber from "lodash/isNumber";
import isString from "lodash/isString";
import authenticatedData from "../data/authenticated";
import visitorData from "../data/visitor";

const CurrencyFormatter = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
});

class NavBuilder {
	/**
	 * Build items object for Navbar (PrimeReact/Menubar).
	 *
	 * @returns {object}
	 */
	static buildMenuItems(isAuth) {
		const sessionData = isAuth ? authenticatedData : visitorData;

		return {
			mail: {
				id: "mail",
				label: "Mail",
			},
			orders: this._getOrdersMenuItem(sessionData),
			marketing: this._getMarketingMenuItem(sessionData),
			products: this._getProductsMenuItem(sessionData),
			contacts: {
				id: "contacts",
				label: "Contacts",
			},
			history: this._getHistoryMenuItem(sessionData),
			reports: this._getReportsMenuItem(sessionData),
			inbounds: this._getInboundsMenuItem(sessionData),
			supplies: this._getSuppliesMenuItem(sessionData),
			balance: this._getBalanceMenuItem(sessionData),
			account: this._getAccountMenuItem(sessionData),
			help: {
				id: "help",
				label: "Help",
				navType: "newTab",
			},
		};
	}

	static _getOrdersMenuItem({ isSignedIn }) {
		const isRestricted = !isSignedIn;

		return {
			id: "orders",
			label: "Orders",
			isRestricted,
			icon: !isSignedIn ? "pi pi-lock" : null, // show lock icon
		};
	}

	static _getMarketingMenuItem({ settings }) {
		return settings?.ShowMarketing === true
			? {
					id: "marketing",
					label: "Marketing",
			  }
			: null;
	}

	static _getProductsMenuItem({ settings }) {
		return settings?.HasShipStationToken === true
			? {
					id: "products",
					label: "Products",
			  }
			: null;
	}

	static _getHistoryMenuItem({ isSignedIn, accountInfo }) {
		const isRestricted = !isSignedIn;
		const isGaPickupCarrier =
			isSignedIn && accountInfo?.globalpost?.firstMileCarrier === "usps";

		return {
			id: "history",
			label: "History",
			isRestricted,
			icon: isRestricted === true ? "pi pi-lock" : null, // show lock icon
			items: [
				{
					id: "searchPrintHistory",
					label: "Search Print History",
					isRestricted,
					icon: isRestricted === true ? "pi pi-lock" : null, // show lock icon
				},
				{
					id: "requestPostageRefund",
					label: "Request a Postage Refund",
				},
				{
					id: "fileInsuranceClaim",
					label: "File an Insurance Claim",
				},
				{
					id: "createScanForm",
					label: "Create a SCAN Form",
					isRestricted: isRestricted,
					icon: isRestricted === true ? "pi pi-lock" : null, // show lock icon
				},
				{
					id: "scheduleUspsPickUp",
					label: "Schedule a USPS Pickup",
				},
				isGaPickupCarrier
					? {
							id: "createContainerLabel",
							label: "Create a Container Label",
					  }
					: null,
			].filter((item) => item),
		};
	}

	static _getReportsMenuItem({ isSignedIn }) {
		const isRestricted = !isSignedIn;

		return {
			id: "reports",
			label: "Reports",
			isRestricted,
			icon: !isSignedIn === true ? "pi pi-lock" : null, // show lock icon
		};
	}

	static _getInboundsMenuItem({ accountInfo, isSignedIn }) {
		return isSignedIn && isArray(accountInfo?.configuredCarriers)
			? {
					id: "inbounds",
					label: "Inbounds",
			  }
			: null;
	}

	static _getSuppliesMenuItem({ isSignedIn, brand }) {
		const isRestricted = !isSignedIn;
		const baseMenuItem = {
			id: "supplies",
			label: "Supplies",
			isRestricted,
			icon: isRestricted === true ? "pi pi-lock" : null, // show lock icon
		};

		return brand?.brandName === "Endicia"
			? baseMenuItem
			: {
					...baseMenuItem,
					items: [
						{
							id: "netstamps",
							label: "NetStamps",
						},
						{
							id: "labels",
							label: "Labels",
						},
						{
							id: "shippingSupplies",
							label: "Shipping Supplies",
						},
						{
							id: "envelopes",
							label: "Envelopes",
						},
						{
							id: "freeUspsSupplies",
							label: "Free USPS Supplies",
						},
					],
			  };
	}

	static _getBalanceMenuItem({ balance, settings, isSignedIn }) {
		const page = isString(settings?.Page) ? settings.Page : "";

		if (
			isSignedIn &&
			page.search(
				/mail|orders|products|contacts|history|reports|inbounds/i
			) !== -1
		) {
			return {
				id: "balance",
				label: "Balance",
				balance: CurrencyFormatter.format(
					isNumber(balance.amount_available)
						? balance.amount_available
						: 0
				),
				items: [
					{
						id: "buyMore",
						label: "Buy More",
					},
					{
						id: "viewPurchaseHistory",
						label: "View Purchase History",
					},
					{
						id: "changePaymentMethod",
						label: "Change Payment Method",
					},
				],
			};
		}

		return null;
	}

	static _getAccountMenuItem({ isSignedIn, settings, accountInfo }) {
		const page = isString(settings.Page) ? settings.Page : "";

		return isSignedIn
			? {
					id: "userName",
					label: accountInfo.customer_details.username,
					items: [
						page !== "account"
							? {
									id: "manageAccount",
									label: "Manage Account",
							  }
							: null,
						{
							id: "legalTerms",
							label: "Legal Terms",
							navType: "newTab",
						},
						{
							id: "signOut",
							label: "Sign Out",
						},
					].filter((item) => item),
			  }
			: {
					id: "signIn",
					label: "Sign In",
					items: [
						{
							id: "signInform", // custom template
						},
						{
							id: "legalTerms",
							label: "Legal Terms",
							navType: "newTab",
						},
					],
			  };
	}
}

export default NavBuilder;
