function calculatorBond(takeSido,usage,displace,carry,person,extra,division,engine,taxBase){
	// usage : 비사업용 P, 사업용 C 
	// division : 승용P, 승합B, 화물T
	var rate = 0;
	var buy = 0;
	var kind = "local";	// 지역개발채권 local, 도시철도 subway
	var year = 5;
	if(takeSido == "SU") year = 7;
	
	if(takeSido == "SU" || takeSido == "BS"  || takeSido == "DG"){	// 도시철도법 시행령, 서울, 부산 대구 
		kind = "subway";
		if(usage == "P" && division =="P" && person <7 ){		// 가. 비사업용 승용자동차  ( 7인 이상 제외) 
			if(engine=="E"){		// 전기자동차
				if(extra.indexOf("1")>=0)  rate = 9;	// 소형
				else if(extra.indexOf("2")>=0)  rate = 12;	// 중형
				else if(extra.indexOf("3")>=0)  rate = 20;	// 대형
				else rate = 12;	// 중형
			}else{	// 내연기관, 1000cc 미만 면제
				if(displace>=1000 && displace<1600 && extra.indexOf("1")>=0) rate = 9;	// 소형 사이즈
				else if(displace>=1000 && displace<1600) rate = 12;	// 중형 사이즈
				else if(displace>=1600 && displace<2000) rate = 12;	// 중형
				else if(displace>=2000) rate = 20;	// 대형
				if(extra.indexOf("M")>=0)  rate = 5;	// 다목적형
				if(takeSido == "BS" || takeSido == "DG"){		// 부산 채권 조례 예외 제3조(도시철도채권의 매입대상 및 금액), 대구 부산과 동일
					if(displace>=1000 && displace<2000) rate = 4;	// 소형/중형 4, 
					else if(displace>=2000) rate = 5;	// 대형 5 
					if(extra.indexOf("M")>=0)  rate = 4;	// 다목적형 4
				}
			}
		}else if(usage == "C" && division =="P" && (extra.indexOf("M")<0 && person <7)){	// 나. 사업용 승용자동차 (다목적, 7인 이하 제외)
			rate = 3;
		}else if(usage == "C"  && division =="P" && extra.indexOf("M")>=0){	// 다. 사업용 다목적형
			rate = 2;
		}else if((division =="P" && person >=7) || division =="B"){	// 라. 7인 이상 승용자동차, 승합자동차
			if(division =="P" || (division =="B" && person >= 11 && person <= 15 && extra.indexOf("1")>=0)){	// 승용차, 승합 11~15인승
				if(usage == "P") rate = 390000;	// 비사업용
				else if(usage == "C") rate = 130000;	// 사업용
			}else if(division =="B" && person >= 11 && person <= 35 ){	// 승합 16~35인승
				if(usage == "P") rate = 650000;	// 비사업용
				else if(usage == "C") rate = 215000;	// 사업용
			}else if(division =="B" && person >= 36 ){	// 승합 36인승 이상
				if(usage == "P") rate = 1300000;	// 비사업용
				else if(usage == "C") rate = 435000;	// 사업용
			}
		}else if(division =="T"){	// 마. 화물자동차
			if(carry<=1000){	// 1톤 이하
				if(usage == "P") rate = 195000;	// 비사업용
				else if(usage == "C") rate = 65000;	// 사업용
			}else if(carry>1000 && carry<5000){	// 1톤 초과, 5톤 미만
				if(usage == "P") rate = 390000;	// 비사업용
				else if(usage == "C") rate = 130000;	// 사업용
			}else if(carry>=5000){	// 5톤 이상
				if(usage == "P") rate = 650000;	// 비사업용
				else if(usage == "C") rate = 215000;	// 사업용
			}
		}
		
		if(takeSido == "DG" || takeSido == "BS"){ // 대구/부산 예외 자동차 신규등록(비사업용 승용자동차 대형 제외) 2020년 12월 31일까지 매입을 면제한다.
			if(usage == "P" && division =="P" && displace>=2000 && person<7 && extra.indexOf("M")<0 ){		// 대형 제외
				
			}else{
				rate = 0;
			}
		}
		
	}else if(takeSido == "KG"){	// 경기
		if(usage == "P" && division =="P"){		// 가. 비영업용 승용자동차
			if(displace>=1000 && displace<=1600) rate = 6;	// 소형
			else if(displace>=1600 && displace<2000) rate = 8;	// 중형
			else if(displace>=2000) rate = 12;	// 대형
		}else if(usage == "P" && division =="B"){		// 나. 비영업용 승합자동차
			if(displace>=1000) rate = 3;		// 1000cc 이상
		}else if(usage == "P" && division =="T"){		// 다. 비영업용 승합자동차
			if(carry<=1000) rate = 1.5;		// 1톤 이하
			else if(carry>1000) rate = 3;		// 1톤 초과
		}else if(usage == "C" && division =="P"){		// 라. 영업용 승용자동차
			if(displace>=1000) rate = 2;		// 1000cc 이상
		}else if(usage == "C" && division =="B"){		// 마. 영업용 승합자동차
			if(displace>=1000) rate = 1;		// 1000cc 이상
		}else if(usage == "C" && division =="T"){		// 바. 영업용 승합자동차
			if(carry<=1000) rate = 0.5;		// 1톤 이하
			else if(carry>1000) rate = 1;		// 1톤 초과
		}
		/*
		if(usage == "P" && division =="P" && taxBase>=50000000){	// 5000만원 이상 제외
			
		}else if(usage == "P" && division =="P" && displace>=2000){	// 2,000cc초과 비영업용 승용자동차 50% 감면
			rate = rate / 2;
		}else{
			rate = 0;
		}
		*/
		// 영업용 2021 면제 
	}else if(takeSido == "IC"){	// 인천, 도시철도/지역개발 별도 운영
		kind = "subway";
		if(usage == "P" && division =="P"){		// 가. 비영업용 승용자동차
			if(displace>=1500 && displace<2000) rate = 4;	// 1500cc 이상
			else if(displace>=2000){	// 2000cc 이상 다목적
				rate = 5;
				if(extra.indexOf("M")>=0) rate = 4;	// 2000cc 이상 다목적
			}
			if(person>=7) rate = 390000;	// 7인승
		}else if(usage == "P" && division =="B"){		// 나. 비영업용 승합자동차
			if(person>=11) rate = 1.5;		// 11인승 이상
		}else if(usage == "P" && division =="T"){		// 다. 비영업용 화물자동차
			if(displace>=1000) rate = 1.5;		// 1000cc 이상
		}
		if(usage == "P" && division =="P" && displace>=2000 && person<7 && extra.indexOf("M")<0 ){		//  일반형 승용자동차 제외
			// 인천 광역시 일시 면제
		}else{
			rate = 0;	
		}
	}else if(takeSido == "KW"){	// 강원 
		if(usage == "P" && division =="P"){		// 가. 비사업용 승용자동차
			if(displace>=1000 && displace<1600) rate = 6;	// 1000cc 이상
			else if(displace>=1600 && displace<2000) rate = 8;	// 1600cc 이상
			else if(displace>=2000) rate = 12;	// 2000cc 이상
		}else if(usage == "P" && division =="B"){		// 나. 비사업용 승합자동차 1000cc 이상
			if(displace>=1000) rate = 3;		// 1000cc 이상
		}else if(usage == "P" && division =="T" && displace>=1000){		// 다. 비사업용 화물자동차 1000cc이상
			if(carry<600) rate = 1.5;		// 0.6톤 미만
			else if(carry>=600) rate = 3;		// 0.6톤 미만
		}else if(usage == "C" && division =="P"){		// 라. 사업용 승용자동차
			if(displace>=1000) rate = 2;	// 1000cc 이상
		}else if(usage == "C" && division =="B"){		// 마. 사업용 승합자동차  1000cc 이상
			if(displace>=1000) rate = 1;		// 1000cc 이상
		}else if(usage == "C" && division =="T" && displace>=1000){		// 바. 사업용 화물자동차 1000cc이상
			if(carry<600) rate = 0.5;		// 0.6톤 미만
			else if(carry>=600) rate = 1;		// 0.6톤 미만
		}
	}else if(takeSido == "DJ"){	// 대전
		if(usage == "P" && division =="P"){		// 가. 비영업용 승용자동차
			if(displace>=1000 && displace<1600) rate = 4;	// 1000cc 이상
			else if(displace>=1600 && displace<2000) rate = 4;	// 1600cc 이상
			else if(displace>=2000) rate = 5;	// 2000cc 이상
		}else if(usage == "P" && division =="B"){		// 나. 비영업용 승합자동차
			if(displace>=1000) rate = 1.5;		// 1000cc 이상
		}else if(usage == "P" && division =="T"){		// 다. 비영업용 화물자동차
			if(displace>=1000) rate = 1.5;		// 1000cc 이상
		}
	}else if(takeSido == "SJ"){	// 세종 
		if(usage == "P" && division =="P"){		// 가. 비사업용 승용자동차
			if(displace>=1000 && displace<1600) rate = 6;	// 1000cc 이상
			else if(displace>=1600 && displace<2000) rate = 8;	// 1600cc 이상
			else if(displace>=2000) rate = 12;	// 2000cc 이상
		}else if(usage == "P" && division =="B"){		// 나. 비사업용 승합자동차 1000cc 이상
			if(displace>=1000) rate = 3;		// 1000cc 이상
		}else if(usage == "P" && division =="T"){		// 다. 비사업용 화물자동차 1000cc이상
			if(displace>=1000) rate = 3;		// 1000cc 이상
		}else if(usage == "C" && division =="P"){		// 라. 사업용 승용자동차
			if(displace>=1000) rate = 2;	// 1000cc 이상
		}else if(usage == "C" && division =="B"){		// 마. 사업용 승합자동차  1000displace 이상
			if(displace>=1000) rate = 1;		// 1000cc 이상
		}else if(usage == "C" && division =="T"){		// 바. 사업용 화물자동차 1000cc이상
			if(displace>=1000) rate = 1;		// 1000cc 이상
		}
	}else if(takeSido == "CB"){	// 충북 
		if(usage == "P" && division =="P"){		// 가. 비영업용 승용자동차
			if(displace>=1000 && displace<1600) rate = 6;	// 1000cc 이상
			else if(displace>=1600 && displace<2000) rate = 8;	// 1600cc 이상
			else if(displace>=2000) rate = 12;	// 2000cc 이상
		}else if(usage == "P" && division =="B"){		// 나. 비영업용 승합자동차
			if(person>=11) rate = 3;		// 11인승 이상
		}else if(usage == "P" && division =="T" && displace>=1000){		// 다. 비영업용 화물자동차 
			if(carry>=1000) rate = 3;		// 1톤 이상
		}else if(usage == "C" && division =="P"){		// 라. 사업용 승용자동차
			if(displace>=1000) rate = 2;	// 1000cc 이상
		}else if(usage == "C" && division =="B"){		// 마. 사업용 승합자동차 
			if(person>=11) rate = 1;		// 11인승 이상
		}else if(usage == "C" && division =="T" && displace>=1000){		// 바. 사업용 화물자동차
			if(carry>=1000) rate = 1;		// 1톤 이상
		}
	}else if(takeSido == "CN"){	// 충남
		if(usage == "P" && division =="P"){		// 가. 비사업용 승용자동차
			if(displace>=1000 && displace<2000) rate = 4;	// 1000cc  이상
			else if(displace>=2000) rate = 5;	// 2000cc 이상
		}else if(usage == "P" && division =="B"){		// 나. 비사업용 승합자동차
			if(displace>=1000) rate = 3;		// 1000cc 이상
		}else if(usage == "P" && division =="T"){		// 다. 비사업용 화물자동차
			if(displace>=1000) rate = 3;		// 1000cc 이상
		}
	}else if(takeSido == "US"){	// 울산 
		if(usage == "P" && division =="P"){		// 가. 비영업용 승용자동차
			if(displace>=1000 && displace<1600) rate = 6;	// 1000cc 이상
			else if(displace>=1600 && displace<2000) rate = 8;	// 1600cc 이상
			else if(displace>=2000) rate = 12;	// 2000cc 이상
		}else if(usage == "P" && division =="B"){		// 나. 비영업용 승합자동차 1000cc 이상
			if(displace>=1000) rate = 3;		// 1000cc 이상
		}else if(usage == "P" && division =="T"){		// 다. 비영업용 화물자동차
			if(carry<600) rate = 1.5;		// 0.6톤 미만
			else if(carry>=600) rate = 3;		// 0.6톤 미만
		}else if(usage == "C" && division =="P"){		// 라. 영업용 승용자동차
			if(displace>=1000) rate = 2;	// 1000cc 이상
		}else if(usage == "C" && division =="B"){		// 마. 영업용 승합자동차  1000cc 이상
			if(displace>=1000) rate = 1;		// 1000cc 이상
		}else if(usage == "C" && division =="T"){		// 바. 영업용 화물자동차
			if(carry<600) rate = 0.5;		// 0.6톤 미만
			else if(carry>=600) rate = 1;		// 0.6톤 미만
		}
	}else if(takeSido == "GB"){	// 경북  
		if(usage == "P" && division =="P"){		// 가. 비사업용 승용자동차
			if(displace>=1000 && displace<1600) rate = 6;	// 1000cc 이상
			else if(displace>=1600 && displace<2000) rate = 8;	// 1600cc 이상
			else if(displace>=2000) rate = 12;	// 2000cc 이상
		}else if(usage == "P" && division =="B"){		// 나. 비사업용 승합자동차 1000cc 이상
			if(displace>=1000) rate = 3;		// 1000cc 이상
		}else if(usage == "P" && division =="T" && displace>=1000){		// 다. 비사업용 화물자동차 1000cc이상
			if(displace>=1000) rate = 3;		// 1000cc 이상
		}else if(usage == "C" && division =="P"){		// 라. 사업용 승용자동차
			if(displace>=1000) rate = 2;	// 1000cc 이상
		}else if(usage == "C" && division =="B"){		// 마. 사업용 승합자동차  1000cc 이상
			if(displace>=1000) rate = 1;		// 1000cc 이상
		}else if(usage == "C" && division =="T"){		// 바. 사업용 화물자동차 1000cc이상
			if(displace>=1000) rate = 1;		// 1000cc 이상
		}
	}else if(takeSido == "GN" || takeSido == "CW"){	// 경남, 창원
		if(usage == "P" && division =="P"){		// 가. 비영업용 승용자동차
			if(displace>=1500 && displace<2000) rate = 4;	// 1500cc 이상
			else if(displace>=2000){ // 2000cc 이상
				rate = 5;	
				if(extra.indexOf("M")>=0) rate = 4;	// 2000cc 이상 다목적
			}
			if(person>=7) rate = 390000;	// 7인승
			if(takeSido == "CW" && displace<2000) rate = 0;  // 창원시 지역개발기금 설치 조례 면제
		}else if(usage == "P" && division =="B"){		// 나. 비영업용 승합자동차
			if(person>=11) rate = 1.5;		// 11인승 이상
		}else if(usage == "P" && division =="T"){		// 다. 비영업용 화물자동차 
			if(carry>=600) rate = 1.5;		// 0.6톤 이상
		}
	}else if(takeSido == "KJ"){	// 광주 
		if(usage == "P" && division =="P"){		// 가. 비영업용 승용자동차
			if(displace>=1000 && displace<1600) rate = 4;	// 1000cc 이상
			else if(displace>=1600 && displace<2000) rate = 4;	// 1600cc 이상
			else if(displace>=2000) rate = 5;	// 2000cc 이상
		}else if(usage == "P" && division =="B"){		// 나. 비영업용 승합자동차 1000cc 이상
			if(displace>=1000) rate = 3;		// 1000cc 이상
		}else if(usage == "P" && division =="T" && displace>=1000){		// 다. 비영업용 화물자동차 1000cc이상
			if(carry<600) rate = 1.5;		// 0.6톤 미만
			else if(carry>=600) rate = 3;		// 0.6톤 미만
		}else if(usage == "C" && division =="P"){		// 라. 영업용 승용자동차
			if(displace>=1000) rate = 2;	// 1000cc 이상
		}else if(usage == "C" && division =="B"){		// 마. 영업용 승합자동차  1000cc 이상
			if(displace>=1000) rate = 1;		// 1000cc 이상
		}else if(usage == "C" && division =="T" && displace>=1000){		// 바. 영업용 화물자동차 1000cc이상
			if(carry<600) rate = 0.5;		// 0.6톤 미만
			else if(carry>=600) rate = 1;		// 0.6톤 미만
		}
	}else if(takeSido == "JB"){	// 전북  
		if(usage == "P" && division =="P"){		// 가. 비사업용 승용자동차
			if(displace>=1000 && displace<1600) rate = 4;	// 1000cc 이상
			else if(displace>=1600 && displace<2000) rate = 6;	// 1600cc 이상
			else if(displace>=2000) rate = 10;	// 2000cc 이상
		}else if(usage == "P" && division =="B"){		// 나. 비사업용 승합자동차
			if(person>=11) rate = 1.5;		// 11인승 이상
		}else if(usage == "P" && division =="T" && displace>=1000){		// 다. 비사업용 화물자동차 1000cc이상
			if(carry>=600) rate = 1.5;		// 0.6톤 이상
		}
	}else if(takeSido == "JN"){	// 전남 
		if(usage == "P" && division =="P"){		// 가. 비영업용 승용자동차
			if(displace>=1000 && displace<1600) rate = 6;	// 1000cc 이상
			else if(displace>=1600 && displace<2000) rate = 8;	// 1600cc 이상
			else if(displace>=2000) rate = 12;	// 2000cc 이상
		}else if(usage == "P" && division =="B"){		// 나. 비영업용 승합자동차 1000cc 이상
			if(displace>=1000) rate = 3;		// 1000cc 이상
		}else if(usage == "P" && division =="T" && displace>=1000){		// 다. 비영업용 화물자동차 1000cc이상
			if(carry<600) rate = 1.5;		// 0.6톤 미만
			else if(carry>=600) rate = 3;		// 0.6톤 미만
		}else if(usage == "C" && division =="P"){		// 라. 영업용 승용자동차
			if(displace>=1000) rate = 2;	// 1000cc 이상
		}else if(usage == "C" && division =="B"){		// 마. 영업용 승합자동차  1000cc 이상
			if(displace>=1000) rate = 1;		// 1000cc 이상
		}else if(usage == "C" && division =="T" && displace>=1000){		// 바. 영업용 화물자동차 1000cc이상
			if(carry<600) rate = 0.5;		// 0.6톤 미만
			else if(carry>=600) rate = 1;		// 0.6톤 미만
		}
	}else if(takeSido == "JJ"){	// 제주
		if(usage == "P" && division =="P"){		// 가. 비영업용 승용자동차
			if(displace>=1000 && displace<1600) rate = 3;	// 1000cc 이상
			else if(displace>=1600 && displace<2000) rate = 4;	// 1600cc 이상
			else if(displace>=2000){	// 2000cc 이상 다목적
				 rate = 5;
				if(extra.indexOf("M")>=0) rate = 4;	// 2000cc 이상 다목적
			}
			if(person>=7) rate = 390000;	// 7인승
		}else if(usage == "P" && division =="B"){		// 나. 비영업용 승합자동차
			if(displace>=1000) rate = 1.5;		// 1000cc 이상
		}else if(usage == "P" && division =="T"){		// 다. 비영업용 화물자동차
			if(displace>=1000) rate = 1.5;		// 1000cc 이상
		}
	}
	
	if(rate>100) buy = rate;
	else if(rate){
		buy = rate / 100  *  taxBase / 5000 ;
		if(kind == "local") buy = number_cut(buy,1,"floor") * 5000;	// 지역개발 버림
		else buy = number_cut(buy,1,"round") * 5000;	// 도시철도 올림
	}
	return [ rate, buy, kind, year ];
}

function calculatorCarTaxY(kind,use,val){
	if(use=="P") use="G";
	else if(use=="C") use="O";
	var rate = 0;
	if(kind=="P" && use=="G"){	// 승용 비영업용
		if(val == 0) rate = 100000;
		else if(val <= 1000 ) rate = 80 * val;
		else if(val <= 1600 ) rate = 140 * val;
		else rate = 200 * val;
	}else if(kind=="P" && use=="O"){	// 승용 영업용
		if(val == 0) rate = 20000;
		else if(val <= 1600 ) rate = 18 * val;
		else if(val <= 2500 ) rate = 19 * val;
		else rate = 24 * val;
	}else if(kind=="B" && use=="G"){	// 승합 비영업용
		if(val == 1) rate = 65000;
		else if(val == 2 ) rate = 115000;
	}else if(kind=="B" && use=="O"){	// 승합 영업용
		if(val == 1) rate = 25000;
		else if(val == 2 ) rate = 42000;
		else if(val == 3 ) rate = 50000;
		else if(val == 4 ) rate = 70000;
		else if(val == 5 ) rate = 100000;
	}else if(kind=="T" && use=="G"){	// 화물 비영업용
		if(val <= 1000) rate = 28500;
		else if(val <=2000 ) rate = 34500;
		else if(val <=3000 ) rate = 48000;
		else if(val <=4000 ) rate = 63000;
		else if(val <=5000 ) rate = 79500;
		else if(val <=8000 ) rate = 130500;
		else if(val <=10000 ) rate = 157500;
		else{
			rate = 157500;
			rate +=  number_cut((val - 10000)/10000, 1, "ceil") * 30000;
		}
	}else if(kind=="T" && use=="O"){	// 화물 비영업용
		if(val <= 1000) rate = 6600;
		else if(val <=2000 ) rate = 9600;
		else if(val <=3000 ) rate = 13500;
		else if(val <=4000 ) rate = 18000;
		else if(val <=5000 ) rate = 22500;
		else if(val <=8000 ) rate = 36000;
		else if(val <=10000 ) rate = 45000;
		else{
			rate = 157500;
			rate +=  number_cut((val - 10000)/10000, 1, "ceil") * 10000;
		}
	}else if(kind=="S" && use=="G"){	// 특수 비영업용
		if(val == 1) rate = 58500;
		else if(val == 2 ) rate = 157500;
	}else if(kind=="S" && use=="O"){	// 특수 영업용
		if(val == 1) rate = 13500;
		else if(val == 2 ) rate = 36000;
	}else if(kind=="M" && use=="G"){	// 3륜이하 비영업용
		rate = 18000;
	}else if(kind=="M" && use=="O"){	// 3륜이하 영업용
		rate = 3300;
	}
	rate = number_cut(rate/2, 10, "floor");

	if(kind == "P" && use == "G"){
		var taxE = number_cut(rate * 0.3, 10, "floor");
		var rateY = (rate + taxE) * 2;
	}else{
		var rateY = rate * 2;
	}
	
	return [rate, rateY];
}

function calculatorDeliveryInsure(kind,val,brand){	// 의무 보험료
	var rate = 0;
	if(brand==111 || brand==112 || brand==121){
		if(kind=="P" && val<7) rate = 2300;
		else if(kind=="P") rate = 3100;
		else if(kind=="B" && val<=25) rate = 3800;
		else if(kind=="B") rate = 5700;	// 카운티 29인승
		else if(kind=="T" && val<=1000) rate = 3400;	// 포터/봉고 3400
		else if(kind=="T") rate = 3000;	// 마이티/메가트럭 3000
	}else if(brand==131){	// 20190208 수정
		if(kind=="P" && val<7) rate = 3710;
		else if(kind=="P") rate = 4370;
		else if(kind=="B") rate = 6110;
		else if(kind=="T") rate = 5190;
	}else if(brand==141){
		if(kind=="P" && val<7) rate = 3710;
		else if(kind=="P") rate = 4370;
		else if(kind=="B") rate = 6110;
		else if(kind=="T") rate = 5190;
	}
	return rate;
}
