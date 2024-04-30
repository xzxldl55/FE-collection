const PROJECT_NAME = 'test-project';
const VERSION = '1';

const GENERIC_STORAGE = {};
const freezeProto = {};
Object.setPrototypeOf(GENERIC_STORAGE, freezeProto)
Object.defineProperty(freezeProto, 'setItem', {
    value: function(key, value) {
        GENERIC_STORAGE[key] = value;
    },
    enumerable: false,
    configurable: false
});
Object.defineProperty(freezeProto, 'getItem', {
    value: function(key) {
        return GENERIC_STORAGE[key];
    },
    enumerable: false,
    configurable: false
});
Object.defineProperty(freezeProto, 'removeItem', {
    value: function(key) {
        delete GENERIC_STORAGE[key];
    },
    enumerable: false,
    configurable: false
});
Object.freeze(freezeProto);

class LocalStorage {
	constructor(projectName, version) {
		this.projectName = projectName;
		this.version = version;
	}

	_getKey(key) {
		if (typeof key !== 'string') {
			throw new TypeError('Key must be a string.');
		}
		return `${this.projectName}_${key}_${this.version}`;
	}

	set(key, value, expires) {
		if (expires && typeof expires !== 'number') {
			throw new TypeError('Expires must be a number.');
		}

		localStorage.setItem(
			this._getKey(key),
			JSON.stringify({
				data: value,
				// 记录当前时间
				expiresTime: expires ? new Date().getTime() + expires : undefined,
			})
		);
	}

	get(key) {
        if (!localStorage.getItem(this._getKey(key))) {
            return null;
        }
		const { data, expiresTime } = JSON.parse(localStorage.getItem(this._getKey(key)));
		const nowTime = new Date().getTime();

		if (expiresTime > nowTime || !expiresTime) {
			return data;
		}
		this.remove(key);
		return null;
	}

	remove(key) {
		localStorage.removeItem(this._getKey(key));
	}
}

// Test
const storage = new LocalStorage(PROJECT_NAME, VERSION);
storage.set('data1', 12580);
storage.set('expires', 'rubbish', 1000);
storage.set('data2', {
	name: 'storageData',
});

console.log(storage.get('data1'));
console.log(storage.get('data2'));

setTimeout(() => {
	console.log(storage.get('expires'));
}, 1000);
