using UnityEngine;
using System.Collections;

public class ChaserMob : WanderingMob {

//  public int scanRange = 10;
  public Transform target;

  public float accelTime = 1;
  public float accelTimeCountdown = 1;

	public bool bTargetFound = false;
	
	public override void Start () {
		base.Start();
    accelTimeCountdown = accelTime;
	}
	
	public override void Update () {
		base.Update();
	}

  public override void FixedUpdate()
  {
    
    base.FixedUpdate();

    accelTimeCountdown -= Time.deltaTime;
    if (accelTimeCountdown < 0)
    {

    }
  }
	
	public override void AIUpdate()
	{
		//var colliders : Collider[] = Physics.OverlapSphere(transform.position,scanRange, 1 << LayerMask.NameToLayer("PlayerShip"));
		//var target : Transform;
		Vector3 difference;

    if (target == null)
    {
      target = MobSpawnerCS.instance.playerShipInstance.transform;
      //if the locked on target is changed, don't try to change it back.  That can be something else, maybe, who knows.
    }

    if (target != null)
    {
      difference = target.position - transform.position;
      currentAcceleration = difference.normalized * accelerationPower;
    }

    //All of this was a way to make it randomly pick a target.  
    //Theory being that you could drop decoys and these things would have a chance of going after them.
    //If I feel like adding that later I'll leave this part in.

    //if(colliders.Length > 0)
    //{	
    //  target = colliders[Random.Range(0, colliders.Length)].transform; //This way, I could eventually add decoys, and it could possibly lock onto a decoy first.
			
    //  difference = target.position - transform.position;
			
    //  if(fDebug) Debug.Log("ChaserMob currentacceleration: " + currentAcceleration);
    //  bTargetFound = true;
    //}
		else
		{
			if (bDebug)Debug.Log("Failed to find target");
			bTargetFound = false;
			base.AIUpdate();
		}
	
	}
}
