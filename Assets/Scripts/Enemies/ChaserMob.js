#pragma strict

public class ChaserMob extends PassiveMob
{

	public var scanRange : int = 10;
	public var bTargetFound : boolean = false;
	
	function Start () {
		super.Start();
	}
	
	function Update () {
		super.Update();
	}
	
	function AIUpdate()
	{
	
		var colliders : Collider[] = Physics.OverlapSphere(transform.position,scanRange, 1 << LayerMask.NameToLayer("PlayerShip"));
		var target : Transform;
		var difference : Vector3;

		if(colliders.Length > 0)
		{	
			target = colliders[Random.Range(0, colliders.Length)].transform; //This way, I could eventually add decoys, and it could possibly lock onto a decoy first.
			
			difference = target.position - transform.position;
			
			currentAcceleration = difference.normalized * accelerationAmount;
			if(fDebug) Debug.Log("ChaserMob currentacceleration: " + currentAcceleration);
			bTargetFound = true;
		}
		else
		{
			if (fDebug)Debug.Log("Failed to find target");
			bTargetFound = false;
			super.AIUpdate();
		}
	
	}
}
