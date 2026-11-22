/*! Eretek Online Araçlar #93 — SLA Kesinti Bütçesi ve Erişilebilirlik */
ERT.def('93', {
	run: function (v, c) {
		var A = v.avail / 100, P = { y: 365 * 86400, q: 365 * 86400 / 4, m: 30 * 86400, w: 7 * 86400, d: 86400 }, rows = [], vv = {};
		if (!(A > 0 && A < 1)) { throw c.fe('avail', 'range'); }
		Object.keys(P).forEach(function (k) { var s = P[k] * (1 - A); vv[k] = Math.round(s * 100) / 100; rows.push([c.t('p_' + k), c.dur(s), c.n(s / 60, 2) + ' ' + c.t('min')]); });
		var msgs = [], kv = [];
		if (v.down !== null && v.down !== undefined) {
			var per = P[v.period], act = 1 - v.down * 60 / per, left = per * (1 - A) - v.down * 60;
			vv.actual = Math.round(act * 1e6) / 1e4; vv.left = Math.round(left / 60 * 100) / 100;
			kv.push([c.t('actual', { p: c.t('p_' + v.period) }), c.n(act * 100, 4) + ' %'], [c.t('left'), left >= 0 ? c.dur(left) : '−' + c.dur(-left)]);
			msgs.push(left >= 0 ? ['ok', c.t('inBudget', { p: c.pct(left / (per * (1 - A)), 0) })] : ['err', c.t('over', { d: c.dur(-left) })]);
		}
		if (v.chain) {
			var parts = String(v.chain).split(/[;\s]+/).filter(Boolean).map(function (x) { var n = ERT.parseNum(x, 'en'); if (!(n > 0 && n <= 100)) { throw c.fe('chain', 'chainFmt'); } return n / 100; });
			var ser = parts.reduce(function (s, a) { return s * a; }, 1), par = 1 - parts.reduce(function (s, a) { return s * (1 - a); }, 1);
			vv.serial = Math.round(ser * 1e8) / 1e6; vv.parallel = Math.round(par * 1e8) / 1e6;
			kv.push([c.t('serial'), c.n(ser * 100, 4) + ' %'], [c.t('parallel'), c.n(par * 100, 6) + ' %']);
			msgs.push(['info', c.t('chainNote')]);
		}
		msgs.push(['info', c.t('month')], ['info', c.t('maint')]);
		return { big: c.t('big', { a: c.n(v.avail, 4), y: c.dur(P.y * (1 - A)) }), kv: kv, msgs: msgs, tables: [{ cols: [c.t('c_p'), c.t('c_d'), c.t('c_m')], rows: rows }], x: { copy: rows.map(function (r) { return r[0] + ': ' + r[1]; }).join('\n') }, v: vv };
	}
});
