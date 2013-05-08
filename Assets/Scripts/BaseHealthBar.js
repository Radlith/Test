#pragma strict

public var xOffset : float = 0;
public var yOffset : float = -15;
public var target : Transform;

public var xSize : int = 30;
public var ySize : int = 6;

public var hptexture : Texture;
public var shieldtexture : Texture;
public var blacktexture : Texture;

public var shieldhpratio : float;
public var bShowShields : boolean;
public var lastshieldhpratio : float;

public var hpratio : float;
private var lasthpratio : float;
private var hpoffset : float;
private var shieldhpoffset : float;

function Start () {
	if(!target) target = gameObject.transform;
}

function Update () {

}

function OnGUI()
{
	hpratio = Mathf.Clamp01(hpratio);

	
	if(hpratio != lasthpratio)
	{
		lasthpratio = hpratio;
		hpoffset = hpratio * xSize;
	}
	
	if(shieldhpratio != lastshieldhpratio)
	{
		lastshieldhpratio = shieldhpratio;
		shieldhpoffset = shieldhpratio * xSize;
	}
	
	var anchor : Vector3 = Camera.mainCamera.WorldToScreenPoint(target.position);
	
	anchor.x += xOffset;
	anchor.y += yOffset;
	
	
	GUI.DrawTexture(new Rect(anchor.x - (xSize / 2) - 1, Camera.mainCamera.pixelHeight - anchor.y + ySize / 2 - 1, xSize + 2, ySize + 2), blacktexture);
	
	if(bShowShields)
	{
		//This should probably be the black texture first, then the other two on top
		
		//HP part
		//GUI.DrawTexture(new Rect(anchor.x - xSize / 2, Camera.mainCamera.pixelHeight - anchor.y, xSize, ySize / 2), hptexture);
		//GUI.DrawTexture(new Rect(anchor.x - (xSize / 2) + hpoffset, Camera.mainCamera.pixelHeight - anchor.y, xSize - shieldhpoffset, ySize / 2), blacktexture);
		GUI.DrawTexture(new Rect(anchor.x - xSize / 2, Camera.mainCamera.pixelHeight - anchor.y + ySize / 2, hpoffset, ySize), hptexture);
		
//		GUI.DrawTexture(new Rect(anchor.x - (xSize / 2) + 1, Camera.mainCamera.pixelHeight - anchor.y + ySize / 2 + 1, xSize + 2, ySize + 2), blacktexture);
		//Shield part
		GUI.DrawTexture(new Rect(anchor.x - xSize / 2, Camera.mainCamera.pixelHeight - anchor.y + ySize / 2, shieldhpoffset, ySize / 2), shieldtexture);
		//GUI.DrawTexture(new Rect(anchor.x - (xSize / 2) + shieldhpoffset, Camera.mainCamera.pixelHeight - anchor.y + ySize / 2, xSize - shieldhpoffset, ySize / 2), blacktexture);
		
		
	}
	else
	{
//		GUI.DrawTexture(new Rect(anchor.x - (xSize / 2) + 1, Camera.mainCamera.pixelHeight - anchor.y + ySize / 2 + 1, xSize + 2, ySize + 2), blacktexture);
		GUI.DrawTexture(new Rect(anchor.x - xSize / 2, Camera.mainCamera.pixelHeight - anchor.y + ySize / 2, hpoffset, ySize), hptexture);
		//GUI.DrawTexture(new Rect(anchor.x - (xSize / 2) + hpoffset, Camera.mainCamera.pixelHeight - anchor.y + ySize / 2, xSize - hpoffset, ySize), blacktexture);
	}
	
}