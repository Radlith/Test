using UnityEngine;
using System.Collections;

public class BaseHealthBarCS : MonoBehaviour {


  public float xOffset  = 0;
  public float yOffset  = -15;
  public Transform target;

  public int xSize = 30;
  public int ySize = 6;

  public Texture hptexture;
  public Texture shieldtexture;
  public Texture blacktexture ;

  public float hpratio ;
  private float lasthpratio ;
  private float hpoffset ;

  public bool bShowShields;
  public float shieldhpratio;
  public float lastshieldhpratio;
  private float shieldhpoffset ;

  public void Start () {
	  if(!target) target = gameObject.transform;
  }

  public void Update () {

  }

  public void OnGUI()
  {

    hpratio = Mathf.Clamp01(hpratio);
    shieldhpratio = Mathf.Clamp01(shieldhpratio);

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
	
	  Vector3 anchor = Camera.mainCamera.WorldToScreenPoint(target.position);
	
	  anchor.x += xOffset;
	  anchor.y += yOffset;
	
	  //Draw background box
	  GUI.DrawTexture(new Rect(anchor.x - (xSize / 2) - 1, Camera.mainCamera.pixelHeight - anchor.y + ySize / 2 - 1, xSize + 2, ySize + 2), blacktexture);
	
    //Draw HP bar
    GUI.DrawTexture(new Rect(anchor.x - xSize / 2, Camera.mainCamera.pixelHeight - anchor.y + ySize / 2, hpoffset, ySize), hptexture);

	  if(bShowShields)
	  {
		  //Shield part
		  GUI.DrawTexture(new Rect(anchor.x - xSize / 2, Camera.mainCamera.pixelHeight - anchor.y + ySize / 2, shieldhpoffset, ySize / 2), shieldtexture);
	  }
  }
}
