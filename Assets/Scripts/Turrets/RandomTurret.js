#pragma strict

public class RandomTurret extends BaseTurret
{
	public var rotateSpeed : float = 30;
	public var currentRotateSpeed : float = 0;
	
	public var bullet : Projectile;
	public var bulletVelocity : float = 10;
	public var projectileDamage : float = 5;

	function Start () {
		super.Start();
		if(!bullet)
		{
			Debug.LogError("Turret has no bullet prefab!");
		}
	}
	
	function Update () {
		super.Update();
		transform.Rotate(0, currentRotateSpeed * Time.deltaTime, 0);
	}
	
	function Fire()
	{
		//var blah : Quaternion = Quaternion.identity;
		//blah = Quaternion.Euler(0,angle,0);
		var test : Transform; 
		var blah : Projectile = Instantiate(bullet, transform.position, transform.rotation);
		test = blah.transform;
		blah.velocity = test.forward * bulletVelocity;
		blah.damageValue = projectileDamage;
		
		RefreshTarget();
		
		if(bDebug) Debug.Log("Turret Fire!");
	}

	function RefreshTarget()
	{
		//For this one it just abruptly rotates to the target.
		//transform.localEulerAngles.y = Random.Range(minAngle, maxAngle);
		currentRotateSpeed = Random.Range(-rotateSpeed, rotateSpeed);
	}
}
