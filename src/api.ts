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
	protected server = require('http').createServer().listen(8580);
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
			let url = this.url.parse(req.url);
			if(url.pathname === '/get/players') this.getPlayers(url,(data) => {
				res.end(data);
			});
			else res.end(JSON.stringify({'status':'OK'}));
		});
	}

	public getPlayers(url,callback): any {
		// /get/players?order_by=points&desc=true

		let players = {
			items: [],
			length: 0
		};
		//console.log(url.query);
		var options = {
			order_by: 'points',
			desc: 'true',
			offset: '0',
			limit: '5'
		},
		temp = null;

		if(url.query !== null) temp = url.query.split('&');

		for(var a in temp){
			let temp2 = temp[a].split('=');
			options[temp2[0]] = temp2[1]; 
		}


		this.pool.getConnection((e, connection) => {
			//console.log(options.order_by);
			//if(e) this.storeError(e,'error.log');
			connection.query(`
				-- запросим игроков с хешем
				SELECT players.hash,nickName,points,wins,assists,losses,countryCode from profiles 
					INNER JOIN players ON players.id = playerId 
				ORDER BY ${options.order_by} ${options.desc === 'true' ? 'DESC':'ASC'} LIMIT ${options.offset},${options.limit};
			`,
			(e, res, fields) => {
				//if(e) this.storeError(e,'error.log');
				connection.release();
				for(var a in res){
					players.items.push(res[a]);
				}
				players.length = res.length;
				callback(JSON.stringify(players));
			});
		});

		//raw select
		//select players.hash,nickName,points,wins,assists,losses,countryCode from profiles INNER JOIN players ON players.id = playerId order by points desc;

	}
}

let main = new Main();
main.init();

var require: any;