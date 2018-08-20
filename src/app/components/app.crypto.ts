import CryptoJS from "crypto-js";
declare var RSA: any;

/** Servicing component for woring with cryptography */
export class AppCrypto {
	private static _rsa = new RSA();
	private static _aes = {
		key: undefined,
		iv: undefined
	};

	/** Gets the base64url-encoded string from the base64 string */
	public static getBase64Url(text: string): string {
		return text.replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
	}

	/** Gets the base64 string from the base64url-encoded string */
	public static getBase64Str(text: string): string {
		let result = text.replace(/\-/g, "+").replace(/\_/g, "/");
		switch (result.length % 4) {
			case 0:
				break;
			case 2:
				result += "==";
				break;
			case 3:
				result += "=";
				break;
			default:
				throw new Error("Illegal base64url string!");
		}
		return result;
	}

	/** Hashs the string to MD5 */
	public static md5(text: string): string {
		return CryptoJS.MD5(text).toString() as string;
	}

	/** Signs the string with the specified key using HMAC SHA256 */
	public static hmacSign(text: string, key: string): string {
		return CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(text, key)) as string;
	}

	/** Signs the string with the specified key using HMAC SHA256 and encode as Base64Url string */
	public static urlSign(text: string, key: string): string {
		return this.getBase64Url(this.hmacSign(text, key));
	}

	/** Encodes the string by Base64Url */
	public static urlEncode(text: string): string {
		return this.getBase64Url(CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text)));
	}

	/** Decodes the string by Base64Url */
	public static urlDecode(text: string): string {
		return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(this.getBase64Str(text))) as string;
	}

	/** Encodes the JSON Web Token */
	public static jwtEncode(jwt: any, key: string): string {
		jwt.iat = Math.round(+new Date() / 1000);
		const encoded = this.urlEncode(JSON.stringify({ typ: "JWT", alg: "HS256" })) + "." + this.urlEncode(JSON.stringify(jwt));
		return encoded + "." + this.urlSign(encoded, key);
	}

	/** Decodes the JSON Web Token */
	public static jwtDecode(jwt: string, key: string): string {
		const elements = jwt.split(".");
		return this.urlSign(elements[0] + "." + elements[1], key) === elements[2]
			? JSON.parse(this.urlDecode(elements[1]))
			: null;
	}

	/** Encrypts the string by RSA */
	public static rsaEncrypt(text: string): string {
		return this._rsa.encrypt(text) as string;
	}

	/** Encrypts the string by AES */
	public static aesEncrypt(text: string, key?: any, iv?: any): string {
		return CryptoJS.AES.encrypt(text, key || this._aes.key, { iv: iv || this._aes.iv }).ciphertext.toString(CryptoJS.enc.Base64) as string;
	}

	/** Decrypts the string by AES */
	public static aesDecrypt(text: string, key?: any, iv?: any): string {
		return CryptoJS.AES.decrypt(text, key || this._aes.key, { iv: iv || this._aes.iv }).toString(CryptoJS.enc.Utf8) as string;
	}

	/** Initializes key for working with RSA and AES */
	public static init(keys: any) {
		if (keys.aes !== undefined && keys.aes != null) {
			this.initAES(keys.aes.key, keys.aes.iv);
		}
		if (keys.rsa !== undefined && keys.rsa != null) {
			this.initRSA(keys.rsa.exponent, keys.rsa.modulus);
		}
	}

	public static initAES(key: string, iv: string) {
		this._aes.key = CryptoJS.enc.Hex.parse(key);
		this._aes.iv = CryptoJS.enc.Hex.parse(iv);
	}

	public static initRSA(exponent: string, modulus: string) {
		this._rsa.init(exponent, modulus);
	}
}