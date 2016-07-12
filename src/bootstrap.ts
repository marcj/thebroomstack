import qfs = require("./qfs");
import path = require("path");
import Q = require("q");
import sql = require("./sql");

interface KeyPair {
	public: string;
	private: string;
}

namespace Bootstrap {

	export const SECRETS_PATH = path.join(require.main.filename, "../../..", "_private");
	const PUBLIC_KEY_PATH = path.join(SECRETS_PATH, "key.pub.pem");
	const PRIVATE_KEY_PATH = path.join(SECRETS_PATH, "key.pem");

	export async function getKeys(): Promise<KeyPair> {
		const [pubKey, privKey] = await Q.all([qfs.readFile(PUBLIC_KEY_PATH), qfs.readFile(PRIVATE_KEY_PATH)]);
		return { public: pubKey, private: privKey };
	}

	export async function getConnectionInfo(): Promise<sql.SqlConnectionInfo> {
		const connectionInfoFilePath = path.join(SECRETS_PATH, "database.json");
		let connectionInfo: sql.SqlConnectionInfo;
		try {
			connectionInfo = JSON.parse(await qfs.readFile(connectionInfoFilePath));
		}
		catch (e) {
			throw "Could not parse connection info file." + e;
		}
		return connectionInfo;
	}
}

export = Bootstrap;
