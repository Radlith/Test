using UnityEngine;
using System.Collections;

public class TurretPlatform : MonoBehaviour {

  //Independent of movement code etc.

  public Vector3[] TurretPoints;
  public BaseTurretCS[] Turrets;

	// Use this for initialization
	void Start () {
	  //The current thing needs a rigidbody.
	}
	
	// Update is called once per frame
	void Update () {
	
	}

  void OnDestroy()
  {
    //Destroy all the things attached to it
    //I suppose a cool effect would be if the disconnected things just all went idle...
    //Dunno.  Thoughts for another time.
  }
}
