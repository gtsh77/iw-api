interface playerList {
	items: playerListItem[];
	length: number;
}

interface playerListItem {
	hash: string;
	nick: string;
	points: number;
	wins: number;
	assists: number;
	losses: number;
	ratio: number;
	country: string;
}

class Main {
	protected server = require('http').createServer().listen(8590);
	protected url = require('url');
	protected pool = require('mysql').createPool({
		connectionLimit : 10,
		multipleStatements: true,
		host            : '192.168.0.16',
		user            : 'api',
		password        : 'apipass',
		database		: 'iwstats'		
	});

	public init(): void {
		console.log('inited');
		this.server.on('request',(req,res) => {
			let url: string = this.url.parse(req.url).pathname;
			if(url === '/get/players') this.getPlayers((data) => {
				res.end(data);
			});
			else res.end(JSON.stringify({'status':'OK'}));
		});
	}

	public getPlayers(callback): any {
		let players = {
			items: [],
			length: 0
		};
		this.pool.getConnection((e, connection) => {
			//if(e) this.storeError(e,'error.log');
			connection.query(`
				-- запросим игроков с хешем
				SELECT players.hash,nickName,points,wins,assists,losses,countryCode from profiles 
					INNER JOIN players ON players.id = playerId 
				ORDER BY points DESC;
			`,
			(e, res, fields) => {
				//if(e) this.storeError(e,'error.log');
				//console.log(`${fields}`);
				connection.release();
				for(var a in res){
					players.items.push(res[a]);
				}
				players.length = res.length;
				callback(JSON.stringify(players));
			});
		});

		//запрос в базу
		//select players.hash,nickName,points,wins,assists,losses,countryCode from profiles INNER JOIN players ON players.id = playerId order by points desc;

		//сборка объекта

	}
}

let main = new Main();
main.init();

var require: any;