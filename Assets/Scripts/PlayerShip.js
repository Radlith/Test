#pragma strict

public class PlayerShip extends BaseHealth
{
	public var bullet : Projectile;
	
	public var acceleration : float = 1;
	public var rotationspeed : float = 1;
	
	public var passivedrag : float = 0.05;
	public var activedrag : float = 1;
	
	public var passiveangulardrag : float = 0.05;
	public var activeangulardrag : float = 1;
	
	public var cooldown : float = 1;
	public var cooldownremaining : float;
	
	public var projectilespeed : float = 5;
	public var projectiledamage : float = 20;
	
	public var burstcount : int = 1;
	public var hpregen : float = 0;
	
	
	private static var Paused : boolean;
	
	function Start () {
		rigidbody.constraints = RigidbodyConstraints.FreezePositionY | RigidbodyConstraints.FreezeRotationX | RigidbodyConstraints.FreezeRotationZ;
		rigidbody.useGravity = false;
		
		super();
	}
	
	function Update () {
	
		if(Input.GetKeyDown(KeyCode.Space))
		{
			if(Time.timeScale == 1)
			{
				Time.timeScale = 0;
				Paused = true;
			}
			else
			{
				Time.timeScale = 1;
				Paused = false;
			}
		}
		super.Update();
	}
	
	//Variables for the pause GUI.
	var selGridInt : int = 0;
	var selStrings : String[] = ["POWER", "ROF", "BURST", "SPEED", "REGEN", "HP"];
	
	
	function OnGUI()
	{
		if(Paused)
		{
					
			if(GUI.Button(Rect(25,25,150,25), "POWER ("  + projectiledamage + ")" ))
			{
				projectiledamage *= 1.1;
			}
			
			
			if(GUI.Button(Rect(25, 50, 150, 25), "ROF (" + cooldown + ")" ))
			{
				cooldown *= 0.9;
			}
			
			
			if(GUI.Button(Rect( 25, 75, 150, 25), "BURST (" + burstcount + ")"))
			{
				burstcount += 1;
			}
			
			if(GUI.Button(Rect(25, 100, 150, 25), "BULLET SPEED (" + projectilespeed + ")"))
			{
				projectilespeed *= 1.1;
			}
			
			if(GUI.Button(Rect(25, 125, 150, 25), "ACCELERATION (" + acceleration + ")"))
			{
				acceleration *= 1.1;
			}
			
			if(GUI.Button(Rect(25, 150, 150, 25), "HP REGEN (" + hpregen + ")"))
			{
				hpregen += 1;
			}
		}
	}
	
	
	function FixedUpdate()
	{
		OldControls();
	}

	//All physics based.  Turning and shooting an axial mounted weapon.
		
	function OldControls()
	{
		if(Input.GetAxis("Vertical") > 0.1)
		{
			rigidbody.AddRelativeForce(Vector3.forward * acceleration, ForceMode.Acceleration);
		}
		
		if(Input.GetAxis("Vertical") < -0.1)
		{
			rigidbody.drag = activedrag;
			rigidbody.angularDrag = activeangulardrag;
		}
		else if(rigidbody.drag > passivedrag)
		{
			rigidbody.drag = passivedrag;
			rigidbody.angularDrag = passiveangulardrag;
		}
		
		rigidbody.AddRelativeTorque(Vector3.up * rotationspeed * Input.GetAxis("Horizontal"));
		
		if(cooldownremaining > 0)
		{
			cooldownremaining -= Time.fixedDeltaTime;
			
			if (cooldownremaining < 0) cooldownremaining = 0;
		}
		else
		{
			if(Input.GetAxis("Fire1") > 0)
			{
				FireProjectile();
				cooldownremaining = cooldown;
			}
		}
	}
	
	
	function FireProjectile()
	{
		//Get facing, spawn projectiles
		if(bullet)
		{
			var blah : Projectile;
			blah = Instantiate(bullet, transform.position, transform.rotation);
			
			blah.colliderLayerMask = (1 << 0) |  (1 << LayerMask.NameToLayer("Enemy")); //Default layer and enemy layer
			//blah.rigidbody.AddForce(this.rigidbody.velocity + this.transform.forward * projectilespeed, ForceMode.VelocityChange);
			blah.velocity = this.transform.forward * projectilespeed;
			blah.damageValue = projectiledamage;
		}
	}
}

