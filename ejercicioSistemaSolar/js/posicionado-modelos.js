var APP =  APP || {};

(function(){

	// Aplica una escala al tiempo en segundos
	function tiempoEnDias(){
		return tiempo*20;
	}

	function posicionarSistemaSolar(){
		posicionarTierra();
	}

	function posicionarTierra(){
		var mTierra=mat4.create();
		mat4.rotate(mTierra,mTierra,(Math.PI/183)*tiempoEnDias(),[0,1,0]);
        mat4.translate(mTierra,mTierra,[60,0,0]);
		
		posicionarLuna(mTierra);
		posicionarIss(mTierra);
		
		// Compenso la traslacion de la tierra con el sol para mantener la inclinacion de la tierra cte con el plano
		mat4.rotate(mTierra,mTierra,-(Math.PI/183)*tiempoEnDias(),[0,1,0]);
		// Eje de la tierra rotado 23 grados
		mat4.rotate(mTierra,mTierra,-0.401426,[0,0,1]);
		mat4.rotate(mTierra,mTierra,(Math.PI*2)*tiempoEnDias(),[0,1,0]);
		setTransform(tierra,mTierra);
	}

	function posicionarLuna(mTierra){
		var mLuna=mat4.create();
		// Traslacion de la luna respecto a la tierra (1 vuelta cada 30 dias)
		mat4.rotate(mLuna,mTierra,(Math.PI/15)*tiempoEnDias(),[0,1,0]);
		mat4.translate(mLuna,mLuna,[20,0,0]);
		setTransform(luna,mLuna);
		posicionarApollo(mLuna);
	}

	function posicionarApollo(mLuna){
		var mApollo=mat4.create();
		mat4.translate(mApollo,mLuna,[1.4,1.4,0]);
		mat4.rotate(mApollo,mApollo,-Math.PI/4, [0,0,1]);
        setTransform(apollo,mApollo);
	}

	function posicionarIss(mTierra){
		var mIss=mat4.create();
		mat4.rotate(mIss,mTierra,(0.2667*Math.PI)*tiempoEnDias(), [0,0,1]);
		mat4.translate(mIss,mIss,[9,0,0]);
		mat4.rotate(mIss,mIss,Math.PI/2, [0,1,0]);
		mat4.rotate(mIss,mIss,-0.523599, [1,0,0]);
        setTransform(iss,mIss);
	}
	
    APP.posicionarSistemaSolar=posicionarSistemaSolar;
    
}())    
